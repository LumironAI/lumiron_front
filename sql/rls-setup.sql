-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_transcript ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Créer une fonction pour vérifier l'abonnement actif d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_subscription_plan(user_id_param INTEGER)
RETURNS TEXT AS $$
DECLARE
  plan_name_var TEXT;
BEGIN
  SELECT plan_name INTO plan_name_var
  FROM subscriptions
  WHERE user_id = user_id_param
    AND status = 'active'
    AND (end_date IS NULL OR end_date > NOW())
  ORDER BY 
    CASE plan_name
      WHEN 'expert' THEN 1
      WHEN 'advanced' THEN 2
      WHEN 'essential' THEN 3
      ELSE 4
    END
  LIMIT 1;
  
  RETURN COALESCE(plan_name_var, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer une fonction pour vérifier le nombre d'agents autorisés par plan
CREATE OR REPLACE FUNCTION public.get_max_agents_allowed(user_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
  plan_name_var TEXT;
BEGIN
  plan_name_var := get_user_subscription_plan(user_id_param);
  
  RETURN CASE plan_name_var
    WHEN 'expert' THEN 2
    WHEN 'advanced' THEN 1
    WHEN 'essential' THEN 1
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer une fonction pour vérifier le nombre d'agents actuels d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_agent_count(user_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
  agent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO agent_count
  FROM agent
  WHERE user_id = user_id_param;
  
  RETURN agent_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer une fonction pour vérifier si un outil est disponible pour un plan
CREATE OR REPLACE FUNCTION public.is_tool_available_for_plan(tool_id_param TEXT, user_id_param INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  plan_name_var TEXT;
  tool_type_var TEXT;
BEGIN
  -- Récupérer le plan de l'utilisateur
  plan_name_var := get_user_subscription_plan(user_id_param);
  
  -- Récupérer le type d'outil
  SELECT type INTO tool_type_var
  FROM tools
  WHERE id = tool_id_param;
  
  -- Vérifier si l'outil est disponible pour le plan
  RETURN CASE
    WHEN plan_name_var = 'expert' THEN TRUE
    WHEN plan_name_var = 'advanced' AND tool_type_var != 'premium' THEN TRUE
    WHEN plan_name_var = 'essential' AND tool_type_var = 'basic' THEN TRUE
    ELSE FALSE
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
