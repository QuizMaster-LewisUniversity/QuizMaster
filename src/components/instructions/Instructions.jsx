// How to Use page. Public guide that walks users through each QuizMaster feature.

import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { INSTRUCTION_SECTIONS, INSTRUCTION_FAQS, FAQ_SECTION } from './instructionsContent';

const TOC_ITEMS = [...INSTRUCTION_SECTIONS, FAQ_SECTION];

export default function Instructions() {
  const { user } = useAuth();
  const isAuthenticated = user && !user.isAnonymous;

  // Logged-out users are sent to sign in instead of a private route that would bounce them home
  const resolvePath = (link) => (link.requiresAuth && !isAuthenticated ? '/signin' : link.path);

  return (
    <div className="min-h-screen py-20 px-6 font-main bg-primary text-primary md:ml-[76px] md:w-[calc(100%_-_76px)] overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-center mb-4 font-main text-gradient-primary">
          How to Use QuizMaster
        </h1>

        <p className="text-xl text-center mb-10 text-secondary">
          Everything you need to take quizzes, build your own, and study smarter.
        </p>

        {isAuthenticated ? (
          <div className="flex justify-center mb-12">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-full bg-btn-primary text-btn-primary hover:bg-btn-primary-hover font-medium transition-all duration-200 shadow-lg"
            >
              ← Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto mb-12 bg-card rounded-2xl border border-accent p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-secondary text-center sm:text-left">
              Sign in to try these features. Polls and public flashcards work without an account.
            </p>
            <Link
              to="/signin"
              className="shrink-0 px-6 py-2 rounded-full bg-btn-primary text-btn-primary hover:bg-btn-primary-hover font-medium transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of contents: pill row on small screens, sticky sidebar on large screens */}
          <nav aria-label="Guide contents" className="lg:w-56 lg:shrink-0">
            <div className="lg:sticky lg:top-24 bg-card rounded-2xl border border-primary p-4">
              <h2 className="hidden lg:block text-sm font-semibold uppercase tracking-wide text-secondary mb-3">
                Contents
              </h2>
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {TOC_ITEMS.map(({ id, title, icon: Icon }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full lg:rounded-lg text-sm text-secondary border border-primary lg:border-transparent hover:text-accent hover:border-accent transition-colors duration-200"
                    >
                      <Icon className="shrink-0" aria-hidden="true" />
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="flex-1 min-w-0 flex flex-col gap-8">
            {INSTRUCTION_SECTIONS.map(({ id, title, icon: Icon, intro, steps, tips, link }) => (
              <section
                key={id}
                id={id}
                className="scroll-mt-24 bg-card rounded-3xl p-8 shadow-xl border border-accent"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="text-2xl text-accent shrink-0" aria-hidden="true" />
                  <h2 className="text-2xl font-semibold font-main text-gradient-primary">{title}</h2>
                </div>

                <p className="text-lg text-secondary mb-5">{intro}</p>

                <ol className="list-decimal pl-6 space-y-2 text-secondary leading-7">
                  {steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>

                {tips && (
                  <div className="mt-5 border-t border-primary pt-4">
                    {tips.map((tip) => (
                      <p key={tip} className="text-sm text-secondary">
                        <span className="font-semibold text-accent">Tip:</span> {tip}
                      </p>
                    ))}
                  </div>
                )}

                {link && (
                  <Link
                    to={resolvePath(link)}
                    className="inline-block mt-6 font-medium text-accent hover:underline"
                  >
                    {link.requiresAuth && !isAuthenticated ? 'Sign in to get started' : link.label} →
                  </Link>
                )}
              </section>
            ))}

            <section
              id={FAQ_SECTION.id}
              className="scroll-mt-24 bg-card rounded-3xl p-8 shadow-xl border border-accent"
            >
              <div className="flex items-center gap-3 mb-5">
                <FAQ_SECTION.icon className="text-2xl text-accent shrink-0" aria-hidden="true" />
                <h2 className="text-2xl font-semibold font-main text-gradient-primary">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {INSTRUCTION_FAQS.map(({ question, answer }) => (
                  <details key={question} className="group rounded-xl border border-primary p-4">
                    <summary className="cursor-pointer font-medium text-primary list-none flex justify-between items-center gap-4">
                      {question}
                      <span className="transition-transform duration-200 group-open:rotate-180" aria-hidden="true">
                        ▾
                      </span>
                    </summary>
                    <p className="mt-3 text-secondary">{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
