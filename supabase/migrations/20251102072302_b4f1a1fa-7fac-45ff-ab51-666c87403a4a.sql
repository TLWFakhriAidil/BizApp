-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

-- Create a new policy that allows users to insert their own role during registration
-- but only once (enforced by unique constraint)
CREATE POLICY "Users can insert their own role on signup"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

-- Keep the admin policy for inserting other users' roles
CREATE POLICY "Admins can insert any role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') AND auth.uid() != user_id
  );