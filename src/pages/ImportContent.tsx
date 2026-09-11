import React from 'react';

import { saveSiteSection } from '../admin/firestoreSiteSections';

/**
 * Script para importar o conteúdo do arquivo JSON para o Firestore.
 * Rode este componente uma única vez (ex: via rota temporária /import-content)
 */
const ImportContent: React.FC = () => {
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleImport = async () => {
    try {
      const response = await fetch('/site_content_migracao.json');
      const siteContent = await response.json();
      for (const key of Object.keys(siteContent)) {
        const section = siteContent[key];
        await saveSiteSection({
          ...section,
          updatedAt: new Date(),
          updatedBy: 'import-script'
        });
      }
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Erro desconhecido');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Importar conteúdo do JSON para o Firestore</h1>
      <button
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={handleImport}
        disabled={done}
      >
        Importar conteúdo
      </button>
      {done && <div className="mt-4 text-green-600 font-semibold">Conteúdo importado com sucesso!</div>}
      {error && <div className="mt-4 text-red-600">Erro: {error}</div>}
    </div>
  );
};

export default ImportContent;
