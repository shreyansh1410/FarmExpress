import React from "react";

const TermsOfService = () => {
  return (
    <section className="px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-4xl rounded-2xl p-6 sm:p-8 apple-glass">
        <h1 className="text-3xl sm:text-4xl font-bold">Terms of Service</h1>
        <p className="mt-2 opacity-70 text-sm">Last updated: April 23, 2026</p>

        <div className="mt-8 space-y-6 text-sm sm:text-base leading-7 opacity-90">
          <div>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By using CargoMatch, you agree to these terms and to use the
              platform in compliance with applicable laws.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">2. User Responsibilities</h2>
            <p className="mt-2">
              You are responsible for maintaining account confidentiality and
              ensuring that the information you provide is accurate and updated.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">3. Service Usage</h2>
            <p className="mt-2">
              The platform is intended for lawful logistics and delivery
              planning activities. Abuse, unauthorized access, or disruption is
              prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">4. Availability</h2>
            <p className="mt-2">
              We strive to keep the service available and reliable, but we do
              not guarantee uninterrupted availability at all times.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              5. Limitation of Liability
            </h2>
            <p className="mt-2">
              CargoMatch is provided on an "as is" basis. To the maximum extent
              permitted by law, we are not liable for indirect or consequential
              damages arising from service use.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">6. Contact</h2>
            <p className="mt-2">
              For terms-related questions, contact{" "}
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

export default TermsOfService;
