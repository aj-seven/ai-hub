import { Zap, CheckCircle, Cpu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Features() {
  return (
    <section className="py-16 px-3">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-4xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Why Choose <span className="text-indigo-600">AI Hub?</span>
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Experience the future of content creation with powerful AI tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <Card className="p-6 shadow border backdrop-blur-md transition hover:shadow-md">
            <CardContent className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Multiple AI Providers
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Access OpenAI, Claude, Gemini, Cohere, and more...
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="p-6 shadow border backdrop-blur-md transition hover:shadow-md">
            <CardContent className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Real-time Generation
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Generate high-quality content in real-time with live API
                integrations.
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="p-6 shadow border backdrop-blur-md transition hover:shadow-md">
            <CardContent className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Easy Integration
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Seamlessly integrate AI-powered tools into your workflow.
              </p>
            </CardContent>
          </Card>

          {/* Card 4 - Ollama Support */}
          <Card className="p-6 shadow border backdrop-blur-md transition hover:shadow-md">
            <CardContent className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                <Cpu className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Ollama Model Support
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Run local LLaMA, Mistral, and other models with Ollama for full
                control and privacy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
