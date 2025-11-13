export type Capitulo = {
  id: string;
  titulo: string;
  resumen: string;
  videoUrl?: string;
};

export const capitulos: Capitulo[] = [
  { id: 'introduccion', titulo: 'Introducción y configuración', resumen: 'Recorrido por la interfaz y ajustes iniciales.', videoUrl: 'https://www.youtube.com/embed/iGuEJU1oJTA?si=nr1V1okmvdmTQE_E' },
  { id: 'modelado-basico', titulo: 'Modelado básico', resumen: 'Primitivas, edición, extrusión y modificadores.', videoUrl: 'https://www.youtube.com/embed/gowbpDSPFcg?si=9QokdXyM9qEYRE9i' },
  { id: 'materiales', titulo: 'Materiales y texturas', resumen: 'Principled BSDF, UVs y texturizado.', videoUrl: '' },
  { id: 'iluminacion', titulo: 'Iluminación', resumen: 'Luces, HDRIs y composición de escena.', videoUrl: '' },
  { id: 'render', titulo: 'Render y exportación', resumen: 'Cycles/Eevee, ajustes de calidad y salida final.', videoUrl: '' },
];

export default capitulos;
