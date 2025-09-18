import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900"
        >
          Welcome to <span className="text-blue-600">AlumniConnect</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto"
        >
          A modern platform built to strengthen the bond between graduates, students, 
          and institutions. Stay connected, network, and support the next generation 
          with ease.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6"
        >
          <a
            href="/directory"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
          >
            Get Started
          </a>
        </motion.div>
      </section>

      {/* Info Card */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="card bg-white shadow-xl rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            Why AlumniConnect?
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            AlumniConnect provides a vibrant space for networking, mentorship, 
            and collaboration, making it easier for alumni to stay engaged with 
            their alma mater while empowering students with valuable insights. 
            From career opportunities and knowledge sharing to event updates and 
            community building, AlumniConnect ensures that meaningful connections 
            last well beyond graduation.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

