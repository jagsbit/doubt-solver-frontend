const features = [
  {
    icon: '❓',
    title: 'Ask Doubts & Get Answers',
    description:
      'Easily ask any academic question and receive accurate, AI-powered answers instantly.',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: '💾',
    title: 'Save Doubts for Later',
    description:
      'Bookmark and organize your doubts to revisit them anytime for future reference or revision.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: '👥',
    title: 'Community Support',
    description:
      'Engage with peers, share knowledge, and get different perspectives from our doubt-solving community.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: '🧠',
    title: 'Practice Quizzes Based on Doubts',
    description:
      'Get automatically generated quizzes tailored to the doubts you’ve asked to strengthen your understanding.',
    color: 'bg-green-100 text-green-600',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#eaf0f9] via-[#d6e6f5] to-[#c4d7e8]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          Why Choose DoubtNest.Ai?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-md mb-4 text-2xl ${feature.color}`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
