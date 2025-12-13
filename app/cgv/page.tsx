import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Conditions Générales de Vente | ${config.appName}`,
  canonicalUrlRelative: "/cgv",
});

const CGV = () => {
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
          Conditions Générales de Vente de {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Dernière mise à jour : ${new Date().toLocaleDateString("fr-FR")}

1. CHAMP D'APPLICATION

Les présentes Conditions Générales de Vente (CGV) régissent la vente de produits et services proposés par ${config.appName}. En effectuant un achat, vous acceptez sans réserve les présentes conditions.

2. PRODUITS ET SERVICES

${config.appName} propose :
- Accès à des contenus numériques
- Services logiciels
- Formations ou tutoriels

Les descriptions des produits et services sont fournies à titre informatif. Des erreurs peuvent contenir des inexactitudes sans engager notre responsabilité.

3. TARIFS ET CONDITIONS DE PAIEMENT

3.1 Les tarifs affichés sont en euros TTC
3.2 Les prix peuvent être modifiés à tout moment
3.3 Le paiement doit être effectué au moment de la commande
3.4 Les moyens de paiement acceptés sont : cartes bancaires, PayPal, et autres moyens sécurisés

4. CONFIRMATION DE LA COMMANDE

Une confirmation de commande vous sera envoyée par email contenant :
- Le récapitulatif de votre commande
- Les conditions de livraison/accès
- Un lien de téléchargement ou d'accès (le cas échéant)

5. DROIT DE RÉTRACTATION

Conformément à la loi française, vous disposez d'un délai de 14 jours pour vous rétracter à compter de la date de votre achat. Pour exercer ce droit :
- Contactez-nous par email : ${config.resend.supportEmail || "contact@example.com"}
- Mentionnez votre numéro de commande
- Joignez les preuves de votre achat

**Exception** : Le droit de rétractation ne s'applique pas aux contenus numériques une fois commencé le téléchargement.

6. LIVRAISON / ACCÈS

6.1 Pour les produits numériques
- Accès immédiat après confirmation du paiement
- Lien de téléchargement envoyé par email
- Disponibilité garantie pendant 30 jours

6.2 Pour les services
- Accès immédiat aux comptes et ressources
- Support disponible pendant la période d'abonnement

7. RESPONSABILITÉ

${config.appName} n'est pas responsable de :
- Les problèmes techniques de votre connexion Internet
- Les erreurs de téléchargement ou de configuration
- Les dommages causés par une mauvaise utilisation des produits

8. PROPRIÉTÉ INTELLECTUELLE

Tous les produits et contenus restent la propriété de ${config.appName}. Vous n'obtenez qu'une licence personnelle, non transférable et limitée pour votre usage personnel.

9. LOIS APPLICABLES

Les présentes CGV sont soumises à la loi française et aux tribunaux compétents.

10. MODIFICATIONS

${config.appName} se réserve le droit de modifier les présentes CGV à tout moment. Les modifications s'appliqueront aux futures commandes.

11. CONTACT

Pour toute question concernant ces CGV :
Email : ${config.resend.supportEmail || "contact@example.com"}`}
        </pre>
      </div>
    </main>
  );
};

export default CGV;
