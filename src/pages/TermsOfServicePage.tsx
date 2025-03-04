
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfServicePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">Last updated: April 1, 2023</p>

        <div className="prose max-w-none">
          <p className="mb-4">
            These Terms of Service ("Terms") govern your access to and use of the AgentCreator website and services 
            (the "Services"). Please read these Terms carefully before using the Services.
          </p>
          <p className="mb-4">
            By accessing or using the Services, you agree to be bound by these Terms. If you do not agree to these 
            Terms, you may not access or use the Services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Account Registration</h2>
          <p className="mb-4">
            To use certain features of the Services, you may need to create an account. You agree to provide 
            accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p className="mb-4">
            You are responsible for safeguarding your account credentials and for all activities that occur under 
            your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Subscription and Payment</h2>
          <p className="mb-4">
            Some features of the Services may require a subscription. By subscribing to a paid plan, you agree to 
            pay the subscription fees as described on our website. Subscription fees are non-refundable except as 
            expressly stated in these Terms.
          </p>
          <p className="mb-4">
            We may change the fees for the Services at any time, but any price changes will apply to your subscription 
            only after notice has been provided to you. If you do not agree to the price change, you may cancel your 
            subscription before the price change takes effect.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Use of the Services</h2>
          <p className="mb-4">
            You agree to use the Services only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Use the Services in any way that violates any applicable law or regulation</li>
            <li>Use the Services to transmit or distribute malware, spyware, or any other harmful code</li>
            <li>Attempt to gain unauthorized access to any portion of the Services or any other systems or networks connected to the Services</li>
            <li>Use the Services to generate content that is illegal, hateful, harassing, or violates the rights of others</li>
            <li>Use the Services to infringe upon the intellectual property rights of others</li>
            <li>Use the Services to engage in any activity that could harm minors</li>
            <li>Use the Services to send unsolicited communications or spam</li>
            <li>Interfere with or disrupt the operation of the Services or servers or networks connected to the Services</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. AI-Generated Content</h2>
          <p className="mb-4">
            The Services may include tools for creating AI agents that generate content ("AI-Generated Content"). 
            You are solely responsible for any AI-Generated Content created through your use of the Services.
          </p>
          <p className="mb-4">
            You agree not to use the Services to create AI agents that:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Generate illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable content</li>
            <li>Impersonate another person or entity</li>
            <li>Infringe upon the intellectual property rights of others</li>
            <li>Violate the privacy or publicity rights of others</li>
            <li>Generate content that could harm minors</li>
          </ul>
          <p className="mb-4">
            We reserve the right to monitor AI-Generated Content created through the Services and to remove any 
            content that violates these Terms or that we determine, in our sole discretion, is harmful or 
            objectionable.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data and Privacy</h2>
          <p className="mb-4">
            Our Privacy Policy, available at [Privacy Policy URL], describes how we collect, use, and share 
            information about you when you use the Services. By using the Services, you agree to our collection, 
            use, and sharing of information as described in the Privacy Policy.
          </p>
          <p className="mb-4">
            You retain all rights to any data you provide to us through the Services, including any data used to 
            train your AI agents. However, you grant us a non-exclusive, worldwide, royalty-free license to use, 
            copy, modify, and display this data solely as necessary to provide the Services to you.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
          <p className="mb-4">
            We retain all rights, title, and interest in and to the Services, including all intellectual property 
            rights. You acknowledge that you do not acquire any ownership rights in the Services.
          </p>
          <p className="mb-4">
            The AgentCreator name, logo, and all related names, logos, product and service names, designs, and 
            slogans are trademarks of AgentCreator or its affiliates. You may not use such marks without our prior 
            written permission.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your access to the Services at any time, with or without cause, and with 
            or without notice. Upon termination, your right to use the Services will immediately cease.
          </p>
          <p className="mb-4">
            You may terminate your account at any time by following the instructions on our website. If you 
            terminate your account, you will remain liable for all amounts due up to and including the date of 
            termination.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Disclaimer of Warranties</h2>
          <p className="mb-4">
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR 
            IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
            PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="mb-4">
            WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, 
            OR THAT THE SERVICES OR THE SERVERS THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL 
            COMPONENTS.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
          <p className="mb-4">
            IN NO EVENT WILL WE BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, 
            INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER 
            DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH 
            DAMAGES.
          </p>
          <p className="mb-4">
            NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER 
            AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY 
            YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Indemnification</h2>
          <p className="mb-4">
            You agree to defend, indemnify, and hold us harmless from and against any claims, liabilities, damages, 
            losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of 
            or in any way connected with your access to or use of the Services or your violation of these Terms.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the State of California, 
            without giving effect to any principles of conflicts of law.
          </p>
          <p className="mb-4">
            Any dispute arising from or relating to these Terms or the Services shall be brought exclusively in the 
            state or federal courts located in San Francisco, California.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Changes to These Terms</h2>
          <p className="mb-4">
            We may update these Terms from time to time. We will notify you of any changes by posting the new Terms 
            on this page and updating the "Last updated" date. You are advised to review these Terms periodically 
            for any changes.
          </p>
          <p className="mb-4">
            Your continued use of the Services after we post changes to these Terms constitutes your acceptance of 
            those changes.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mb-4">
            Email: legal@agentcreator.com<br />
            Address: 123 AI Avenue, San Francisco, CA 94107
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
