import React from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Text style={styles.sectionTitle}>{children}</Text>
);

const SubsectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Text style={styles.subsectionTitle}>{children}</Text>
);

const Paragraph = ({ children }: { children: React.ReactNode }) => (
    <Text style={styles.paragraph}>{children}</Text>
);

const BulletList = ({ items }: { items: string[] }) => (
    <View style={styles.bulletList}>
        {items.map((item, index) => (
            <View key={index} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
            </View>
        ))}
    </View>
);

function PrivacyPolicy() {
    return (
        <SafeAreaView className="flex-1 bg-gray-900 pb-10">
            <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>Politique de Confidentialité</Text>
                <Text style={styles.date}>Dernière mise à jour : 27 janvier 2025</Text>

                <SectionTitle>1. Introduction</SectionTitle>
                <Paragraph>
                    1Riche1Pauvre s'engage à protéger la confidentialité des utilisateurs.
                    Cette politique détaille nos pratiques concernant la collecte et
                    l'utilisation des données.
                </Paragraph>

                <SectionTitle>2. Données Collectées</SectionTitle>
                <SubsectionTitle>2.1 Données Personnelles</SubsectionTitle>
                <BulletList items={[
                    'Nom et prénom',
                    'Adresse email',
                    'Numéro de téléphone',
                    'Documents d\'identité',
                    'ville',
                    'Photo de profil'
                ]} />

                <SubsectionTitle>2.2 Données de Transaction</SubsectionTitle>
                <BulletList items={[
                    'Historique des dons',
                    'Projets créés',
                    'Interactions avec les projets'
                ]} />

                <SectionTitle>3. Utilisation des Données</SectionTitle>
                <Paragraph>Nous utilisons vos données pour :</Paragraph>
                <BulletList items={[
                    'Gérer votre compte',
                    'Traiter les dons',
                    'Vérifier votre identité',
                    'Sécuriser les transactions',
                    'Améliorer nos services',
                    'Communiquer sur les projets'
                ]} />

                <SectionTitle>4. Protection des Données</SectionTitle>
                <Paragraph>
                    Nous mettons en œuvre des mesures de sécurité pour protéger vos données :
                </Paragraph>
                <BulletList items={[
                    'Chiffrement des données sensibles',
                    'Authentification sécurisée',
                    'Accès restreint aux données personnelles',
                    'Sauvegardes régulières'
                ]} />

                <SectionTitle>5. Partage des Données</SectionTitle>
                <Paragraph>Nous partageons vos données uniquement avec :</Paragraph>
                <BulletList items={[
                    'Les prestataires de paiement pour traiter les transactions',
                    'Les autorités sur demande légale',
                    'Les partenaires de vérification d\'identité'
                ]} />

                <SectionTitle>6. Droits des Utilisateurs</SectionTitle>
                <Paragraph>Vous disposez des droits suivants :</Paragraph>
                <BulletList items={[
                    'Accès à vos données',
                    'Rectification des informations',
                    'Suppression de votre compte',
                    'Opposition au traitement',
                    'Portabilité des données'
                ]} />

                <SectionTitle>7. Conservation des Données</SectionTitle>
                <Paragraph>Nous conservons vos données :</Paragraph>
                <BulletList items={[
                    'Pendant la durée de votre inscription',
                    '5 ans après la dernière activité',
                    'Selon les obligations légales'
                ]} />

                <SectionTitle>8. Contact</SectionTitle>
                <Paragraph>Pour toute question :</Paragraph>
                <Text style={styles.contactInfo}>Email :Unricheunpauvre@gmail.com</Text>

                <SectionTitle>9. Modifications</SectionTitle>
                <Paragraph>
                    Nous nous réservons le droit de modifier cette politique. Les utilisateurs
                    seront notifiés des changements importants.
                </Paragraph>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#f5f5f5',
    // },
    scrollView: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f5f5f5',
        marginBottom: 8,
        marginTop: 24,
        textAlign: 'center',
    },
    date: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 24,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ccc',
        marginTop: 24,
        marginBottom: 12,
    },
    subsectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ccc',
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 16,
        color: '#f5f5f5',
        lineHeight: 24,
        marginBottom: 12,
    },
    bulletList: {
        marginLeft: 8,
        marginBottom: 16,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    bullet: {
        fontSize: 16,
        color: '#ccc',
        marginRight: 8,
        marginTop: 2,
    },
    bulletText: {
        flex: 1,
        fontSize: 16,
        color: '#ccc',
        lineHeight: 24,
    },
    contactInfo: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 8,
        marginLeft: 16,
    },
});

export default PrivacyPolicy;