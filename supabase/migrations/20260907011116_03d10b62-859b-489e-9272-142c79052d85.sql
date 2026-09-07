CREATE POLICY "Portfolio covers are viewable" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Admins upload portfolio covers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update portfolio covers" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete portfolio covers" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));