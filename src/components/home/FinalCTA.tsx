import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="my-12 space-y-6 rounded-lg bg-foreground p-12 text-center text-background">
      <h2 className="text-3xl font-bold">
        Pronto para comprar viaturas importadas sem intermediários?
      </h2>
      <p className="mx-auto max-w-2xl text-lg">
        Junte-se a centenas de concessionários e retalhistas que confiam na ReDrive para os seus
        leilões semanais.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={() => navigate({ to: "/register" })}
          className="bg-primary px-8 py-3 text-primary-foreground hover:bg-primary/90"
        >
          Registar agora
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/auctions" })}
          className="border-background px-8 py-3 text-background hover:bg-background hover:text-foreground"
        >
          Ver catálogo
        </Button>
      </div>
    </section>
  );
}
