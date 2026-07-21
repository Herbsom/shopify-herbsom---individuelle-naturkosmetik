import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function RoutineOverview() {
  const { t } = useTranslation();
  const routines = [
    {
      slug: "reife-haut",
      title: "Reife Haut",
      description: "Gegen Falten, Hautalterung und Elastizitätsverlust",
      icon: "👑",
    },
    {
      slug: "trockene-haut",
      title: "Trockene Haut",
      description: "Gegen trockene Stellen, Spannungsgefühl und Trockenheitsfältchen",
      icon: "💧",
    },
    {
      slug: "unreine-haut",
      title: "Unreine Haut",
      description: "Gegen Pickel, Mitesser und Hautunreinheiten",
      icon: "✨",
    },
    {
      slug: "mischhaut",
      title: "Mischhaut & Ölige Haut",
      description: "Gegen Hautglanz, große Poren und unausgeglichene Haut",
      icon: "⚖️",
    },
    {
      slug: "empfindliche-haut",
      title: "Empfindliche Haut",
      description: "Beruhigung und Schutz für reaktive Haut",
      icon: "🌸",
    },
    {
      slug: "normale-haut",
      title: "Normale Haut",
      description: "Pflege für ausgeglichene und gesunde Haut",
      icon: "🌟",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-beige-50 to-background">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl mb-4 text-foreground">
              Deine Perfekte Routine
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Finde die ideale Hautpflege-Routine für deinen Hauttyp. Jede Routine ist individuell auf deine Bedürfnisse abgestimmt.
            </p>
          </div>

          {/* Routines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map((routine) => (
              <Link key={routine.slug} href={`/routines/${routine.slug}`}>
                <Card className="h-full p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-4xl mb-4">{routine.icon}</div>
                  <h3 className="font-display text-xl mb-2 text-foreground">
                    {routine.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    {routine.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    Zur Routine →
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-beige-100">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-4 text-foreground">
            Unsicher, welche Routine zu dir passt?
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-8">
            Mache unseren Hauttest und erhalte personalisierte Empfehlungen basierend auf deinem Hauttyp.
          </p>
          <Link href="/hauttest">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
              Jetzt Hauttest starten
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
