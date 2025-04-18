-- Politiques pour la table users
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Politiques pour la table agent
CREATE POLICY "Les utilisateurs peuvent voir leurs propres agents"
  ON agent FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer des agents selon leur plan"
  ON agent FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    get_user_agent_count(auth.uid()) < get_max_agents_allowed(auth.uid())
  );

CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres agents"
  ON agent FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres agents"
  ON agent FOR DELETE
  USING (auth.uid() = user_id);

-- Politiques pour la table agent_tools
CREATE POLICY "Les utilisateurs peuvent voir les outils de leurs agents"
  ON agent_tools FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agent
      WHERE agent.id = agent_tools.agent_id
      AND agent.user_id = auth.uid()
    )
  );

CREATE POLICY "Les utilisateurs peuvent ajouter des outils selon leur plan"
  ON agent_tools FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agent
      WHERE agent.id = agent_tools.agent_id
      AND agent.user_id = auth.uid()
    ) AND
    is_tool_available_for_plan(agent_tools.tool_id, auth.uid())
  );

CREATE POLICY "Les utilisateurs peuvent mettre à jour les outils de leurs agents"
  ON agent_tools FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM agent
      WHERE agent.id = agent_tools.agent_id
      AND agent.user_id = auth.uid()
    )
  );

CREATE POLICY "Les utilisateurs peuvent supprimer les outils de leurs agents"
  ON agent_tools FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM agent
      WHERE agent.id = agent_tools.agent_id
      AND agent.user_id = auth.uid()
    )
  );

-- Politiques pour la table call_log
CREATE POLICY "Les utilisateurs peuvent voir les logs d'appels de leurs agents"
  ON call_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agent
      WHERE agent.id = call_log.agent_id
      AND agent.user_id = auth.uid()
    )
  );

-- Politiques pour la table phone_numbers
CREATE POLICY "Les utilisateurs peuvent voir les numéros de téléphone disponibles"
  ON phone_numbers FOR SELECT
  USING (is_available = TRUE OR 
    EXISTS (
      SELECT 1 FROM agent
      WHERE agent.id = phone_numbers.assigned_agent_id
      AND agent.user_id = auth.uid()
    )
  );

CREATE POLICY "Les utilisateurs peuvent assigner des numéros à leurs agents"
  ON phone_numbers FOR UPDATE
  USING (
    is_available = TRUE OR
    EXISTS (
      SELECT 1 FROM agent
      WHERE agent.id = phone_numbers.assigned_agent_id
      AND agent.user_id = auth.uid()
    )
  );

-- Politiques pour la table subscriptions
CREATE POLICY "Les utilisateurs peuvent voir leurs propres abonnements"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Seul le système peut créer des abonnements"
  ON subscriptions FOR INSERT
  WITH CHECK (role() = 'service_role');

CREATE POLICY "Seul le système peut mettre à jour des abonnements"
  ON subscriptions FOR UPDATE
  USING (role() = 'service_role');
