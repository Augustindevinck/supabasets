import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Politique de cookies | ${config.appName}`,
  canonicalUrlRelative: "/cookie-policy",
});

const CookiePolicy = () => {
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
          Politique de cookies de {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Dernière mise à jour : ${new Date().toLocaleDateString("fr-FR")}

1. QU'EST-CE QU'UN COOKIE ?

Un cookie est un petit fichier texte stocké sur votre appareil par votre navigateur lors de la visite d'un site web. Il permet de mémoriser certaines informations vous concernant.

2. COOKIES UTILISÉS PAR ${config.appName}

Nous utilisons les types de cookies suivants :

2.1 Cookies essentiels
- Nécessaires au fonctionnement du site
- Permettent la navigation et l'authentification
- Obligatoires pour l'accès au service

2.2 Cookies de performance
- Collectent des données sur l'utilisation du site
- Aident à améliorer les performances
- Permettent d'identifier les problèmes techniques

2.3 Cookies de marketing
- Utilisés pour suivre vos intérêts
- Permettent de personnaliser le contenu
- Peuvent être partagés avec des partenaires publicitaires

3. CONSENTEMENT

L'accès à ${config.appName} implique votre consentement à l'utilisation de cookies. Vous pouvez refuser ou supprimer les cookies non essentiels via les paramètres de votre navigateur.

4. GESTION DES COOKIES

4.1 Pour accepter ou refuser les cookies
- Google Chrome : Paramètres > Confidentialité > Cookies
- Firefox : Préférences > Vie privée > Cookies
- Safari : Préférences > Confidentialité > Cookies
- Edge : Paramètres > Confidentialité > Cookies

4.2 Comment supprimer les cookies
- Vous pouvez supprimer tous les cookies en vidant l'historique de navigation
- Consultez l'aide de votre navigateur pour plus d'instructions

5. COOKIES TIERS

Certains services tiers peuvent placer leurs propres cookies sur votre navigateur :
- Outils d'analyse (Google Analytics)
- Services publicitaires
- Réseaux sociaux

6. MODIFICATIONS DE CETTE POLITIQUE

${config.appName} peut modifier cette politique de cookies à tout moment. Les modifications seront publiées sur cette page avec la date de mise à jour.

7. NOUS CONTACTER

Pour toute question concernant cette politique de cookies, veuillez nous contacter à :
Email : ${config.resend.supportEmail || "contact@example.com"}`}
        </pre>
      </div>
    </main>
  );
};

export default CookiePolicy;
