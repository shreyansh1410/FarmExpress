import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-4xl rounded-2xl p-6 sm:p-8 apple-glass">
        <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 opacity-70 text-sm">Last updated: April 23, 2026</p>

        <div className="mt-8 space-y-6 text-sm sm:text-base leading-7 opacity-90">
          <div>
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="mt-2">
              We collect account details such as company name, email address,
              registration number, and any logistics data you provide while
              using CargoMatch.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">2. How We Use Information</h2>
            <p className="mt-2">
              Your information is used to authenticate your account, manage
              truck schedules, and improve reliability and security of the
              platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">3. Cookies and Sessions</h2>
            <p className="mt-2">
              We use secure authentication cookies to keep you signed in and to
              protect account sessions. You can clear cookies from your browser
              at any time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">4. Data Sharing</h2>
            <p className="mt-2">
              We do not sell your personal data. Information may only be shared
              with trusted infrastructure providers required to run this service
              securely.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">5. Data Security</h2>
            <p className="mt-2">
              We apply reasonable technical and organizational safeguards to
              protect your information from unauthorized access.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">6. Contact</h2>
            <p className="mt-2">
              For privacy questions, contact us at{" "}
              <a
                href="mailto:Admin@RuntimeTerror.com"
                className="text-primary hover:underline"
              >
                22156@iiitu.ac.in
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
