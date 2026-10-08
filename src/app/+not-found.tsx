import { Link } from "expo-router";

import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      icon="help-circle"
      title="Página não encontrada"
      description="O endereço que você abriu não existe neste app."
    >
      <Link href={"/"} asChild>
        <Button>
          <Button.Text>Ir para o cardápio</Button.Text>
        </Button>
      </Link>
    </EmptyState>
  );
}
