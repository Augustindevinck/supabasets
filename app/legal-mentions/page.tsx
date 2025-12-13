import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Mentions légales | ${config.appName}`,
  canonicalUrlRelative: "/legal-mentions",
});

const LegalMentions = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Mentions légales de {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Dernière mise à jour : ${new Date().toLocaleDateString("fr-FR")}

1. ÉDITEUR DU SITE

Nom de l'entreprise : ${config.appName}
Adresse : [À compléter avec votre adresse]
Numéro SIRET : [À compléter]
Téléphone : [À compléter]
Email : ${config.resend.supportEmail || "contact@example.com"}

2. DIRECTEUR DE LA PUBLICATION

[À compléter avec le nom et fonction]

3. HÉBERGEUR

Nom : [À compléter avec le nom de votre hébergeur]
Adresse : [À compléter avec l'adresse de l'hébergeur]

4. DROITS DE PROPRIÉTÉ INTELLECTUELLE

Le contenu de ce site (textes, images, graphismes) est la propriété exclusive de ${config.appName}, sauf mention contraire. Toute reproduction, distribution ou exploitation sans autorisation est interdite.

5. RESPONSABILITÉ

${config.appName} s'efforce de fournir des informations exactes et à jour, mais ne peut être tenu responsable d'inexactitudes ou d'erreurs.

6. LIMITATION DE RESPONSABILITÉ

L'accès et l'utilisation du site sont fournis "en l'état". ${config.appName} ne garantit pas l'absence d'interruptions ou d'erreurs techniques.

7. LIENS EXTERNES

Les liens vers des sites externes sont fournis à titre informatif. ${config.appName} ne contrôle pas et n'est pas responsable du contenu de ces sites tiers.

8. LOIS APPLICABLES

Ces mentions légales sont soumises à la loi française.

Pour toute question concernant ces mentions légales, veuillez nous contacter à : ${config.resend.supportEmail || "contact@example.com"}`}
        </pre>
      </div>
    </main>
  );
};

export default LegalMentions;
