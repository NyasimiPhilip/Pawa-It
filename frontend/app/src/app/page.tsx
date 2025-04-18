'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex flex-col text-gray-200">
      <header className="border-b border-gray-700 bg-[#1e1e1e] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">Q&A</span>
            </div>
            <span className="font-semibold text-lg text-gray-100">Q&A Assistant</span>
          </div>
          <div>
            <Link
              href="/login"
              className="text-blue-400 font-medium hover:text-blue-300 transition-colors px-4 py-2"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center max-w-7xl mx-auto w-full px-6 py-12 gap-8">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 leading-tight">
            Get answers with AI assistant
          </h1>
          <p className="text-xl text-gray-400">
            A powerful AI assistant that helps you find the information you need. Ask questions, get answers, and make your workflow more efficient.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="border border-gray-600 px-6 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors text-center text-gray-200"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <div className="bg-[#1e1e1e] rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="text-white font-bold">Q&A</span>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 rounded-tl-none text-gray-200">
                <p>
                  Hello! I&apos;m your AI assistant. I can help you find information, answer questions, and assist with various tasks. How can I help you today?
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="text-gray-200 font-bold">U</span>
              </div>
              <div className="bg-blue-600 text-white rounded-2xl p-4 rounded-tl-none">
                <p>
                  Can you help me understand how to use this Q&A system?
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="text-white font-bold">Q&A</span>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 rounded-tl-none text-gray-200">
                <p>
                  Of course! This Q&A system allows you to ask questions and get AI-powered responses. Simply create an account, log in, and type your questions in the chat interface. I&apos;ll provide answers and retain your conversation history for future reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-700 bg-[#1e1e1e] py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2023 Q&A Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
