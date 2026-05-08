import { PageContainer } from '@/components/shell/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';

export default function NewTransactionPage() {
  return (
    <PageContainer title="Registrar" eyebrow="Proximamente">
      <EmptyState
        title="Registro rapido pendiente"
        message="Esta ruta queda lista para la Fase 3B. No guarda datos todavia porque toda escritura debe pasar por confirmacion."
      />
    </PageContainer>
  );
}
