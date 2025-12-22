import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Judge Not Found | DevForge Hackathon',
  description: 'The requested judge verification page could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">Judge Not Found</h1>
        <p className="text-neutral-600 mb-6">
          The verification ID you entered could not be found in our system. Please check the ID and try again.
        </p>
        
        <div className="space-y-3">
          <a
            href="/hackathon"
            className="block w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Return to Hackathon Page
          </a>
          <p className="text-sm text-neutral-500">
            For assistance, contact <a href="mailto:support@code4o4.xyz" className="text-orange-600 hover:underline">support@code4o4.xyz</a>
          </p>
        </div>
      </div>
    </div>
  );
}
