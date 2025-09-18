// Achievement.jsx
import { motion } from "framer-motion";
import { Card } from "../components/ui/card";

const Achievement = () => {
  const companies = [
    { name: "TCS", src: "src/assets/tcs.png" },
    { name: "Amazon", src: "src/assets/amazon.jpeg" },
    { name: "Autodesk", src: "src/assets/autodesk.png" },
    { name: "Oracle", src: "src/assets/oracle.png" },
    { name: "State Street Corporation", src: "src/assets/state-street.png" },
    { name: "Larsen & Toubro", src: "src/assets/larsen-toubro.png" },
  ];

  return (
    <motion.section 
      className="py-12 px-6 bg-gradient-to-b from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Top <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">Alumni</span> Placed in:
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </motion.div>

        {/* Company Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="flex justify-center"
            >
              <Card className="p-6 shadow-md rounded-xl flex items-center justify-center w-full h-32 bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
                <img 
                  src={company.src} 
                  alt={company.name} 
                  className="max-h-16 max-w-full object-contain hover:grayscale-0 transition-all duration-300"
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {/* <button className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 font-medium shadow-md hover:shadow-lg">
            View all Partners
          </button> */}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Achievement;