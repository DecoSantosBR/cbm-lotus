-- Script para popular cursos do CBM Lotus
-- Execute este script após criar o banco de dados

-- Limpar cursos existentes (opcional)
-- DELETE FROM courses;

-- Inserir cursos obrigatórios
INSERT INTO courses (nome, valor, categoria) VALUES
('TAF', 'Gratuito', 'obrigatorio'),
('Modulação e Conduta', 'Gratuito', 'obrigatorio'),
('MOB', 'R$ 200.000', 'obrigatorio'),
('Aerovidas', 'R$ 300.000', 'obrigatorio'),
('Mergulho', 'Gratuito', 'obrigatorio'),
('Paraquedismo', 'R$ 250.000', 'obrigatorio'),
('Resgate Montanha', 'R$ 300.000', 'obrigatorio'),
('Formação de Oficiais', 'Gratuito', 'obrigatorio');

-- Inserir cursos facultativos
INSERT INTO courses (nome, valor, categoria) VALUES
('Águia Avançado', 'R$ 400.000', 'facultativo'),
('Instrutor Águia', 'R$ 600.000', 'facultativo'),
('Paraquedismo Avançado', 'R$ 500.000', 'facultativo'),
('Resgate Montanha Avançado', 'R$ 500.000', 'facultativo'),
('Instrutor MOB', 'R$ 600.000', 'facultativo');
