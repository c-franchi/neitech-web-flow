import React from 'react';
import { initialSections } from '../admin/SiteSections';
import { saveSiteSection, fetchSiteSection } from '../admin/firestoreSiteSections';

/**
 * Script para popular/atualizar o Firestore com as seções do site.
 * - Cria seções que não existem
 * - Adiciona campos faltantes em seções existentes (sem sobrescrever dados editados)
 */
const SetupSections: React.FC = () => {
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [log, setLog] = React.useState<string[]>([]);

  const handlePopulate = async () => {
    try {
      const messages: string[] = [];
      for (const section of initialSections) {
        const existing = await fetchSiteSection(section.id);
        if (existing) {
          // Mescla campos faltantes do template no conteúdo existente
          const mergedContent = { ...section.content };
          const existingContent = existing.content || {};
          // Mantém valores já editados, só adiciona campos novos
          for (const key of Object.keys(mergedContent)) {
            if (key in existingContent) {
              mergedContent[key] = existingContent[key];
            }
          }
          const hadMissing = Object.keys(mergedContent).some(k => !(k in existingContent));
          if (hadMissing) {
            await saveSiteSection({ ...existing, content: mergedContent, label: section.label, name: section.name });
            messages.push(`🔄 "${section.label}" atualizada — campos faltantes adicionados.`);
          } else {
            messages.push(`⏭ "${section.label}" já está completa — ignorada.`);
          }
        } else {
          await saveSiteSection(section);
          messages.push(`✅ "${section.label}" criada com sucesso.`);
        }
      }
      setLog(messages);
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Erro desconhecido');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Popular seções iniciais do site</h1>
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handlePopulate}
        disabled={done}
      >
        Popular Firestore
      </button>
      {done && (
        <div className="mt-4 space-y-1">
          {log.map((msg, i) => (
            <div key={i} className="text-sm text-gray-700">{msg}</div>
          ))}
          <div className="text-green-600 font-semibold mt-2">Processo concluído!</div>
        </div>
      )}
      {error && <div className="mt-4 text-red-600">Erro: {error}</div>}
    </div>
  );
};

export default SetupSections;
