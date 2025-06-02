
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { timelineEvents, culturalFacts } from '@/data/historyData';

const HistoryPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Malawian History</h1>
            <p className="text-xl opacity-90">
              Journey through time and explore the rich tapestry of events, people, and cultural developments that shaped modern Malawi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="timeline" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="timeline">Historical Timeline</TabsTrigger>
              <TabsTrigger value="culture">Cultural Heritage</TabsTrigger>
            </TabsList>
            
            {/* Timeline Tab */}
            <TabsContent value="timeline" className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl font-bold mb-6 text-green-800">Timeline of Malawi</h2>
                  <p className="text-gray-700 mb-8">
                    From ancient settlements to colonial rule and independence, explore the key events that shaped Malawi's history.
                  </p>
                </motion.div>

                <div className="space-y-12 pl-6 border-l-2 border-green-600">
                  {timelineEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="timeline-item relative pl-8"
                    >
                      <div className="absolute left-[-41px] top-0 bg-white p-1">
                        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-6">
                        <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-3">
                          {event.year}
                        </span>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-700">{event.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
            
            {/* Culture Tab */}
            <TabsContent value="culture" className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl font-bold mb-6 text-green-800">Cultural Heritage</h2>
                  <p className="text-gray-700 mb-8">
                    Malawi's rich cultural heritage is a blend of traditions, languages, arts, and practices that have evolved over centuries.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {culturalFacts.map((fact, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200"
                    >
                      <h3 className="text-xl font-bold mb-3 text-green-800">{fact.title}</h3>
                      <p className="text-gray-700">{fact.description}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div variants={itemVariants} className="mt-12">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-2xl font-bold mb-4 text-green-800">The Warm Heart of Africa</h3>
                    <p className="text-gray-700 mb-4">
                      Malawi is often called "The Warm Heart of Africa" due to the friendliness and hospitality of its people. This cultural characteristic has been shaped by centuries of community-focused traditions and values.
                    </p>
                    <p className="text-gray-700">
                      The country's cultural identity continues to evolve while maintaining strong connections to its historical roots, creating a unique blend of traditional and contemporary expressions.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="relative overflow-hidden rounded-lg h-64 mt-8">
                    <img  className="w-full h-full object-cover" alt="Traditional Malawian cultural performance" src="https://images.unsplash.com/photo-1674320137750-8f06dcc23a45" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">Living Traditions</h3>
                        <p>Many cultural practices and traditions continue to thrive in modern Malawi, connecting present generations to their ancestors.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Historical Significance</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Malawi's history is a testament to the resilience and determination of its people. From the early Bantu settlements around Lake Malawi to the powerful Maravi Kingdom that gave the country its name, the foundations of Malawian identity were established long before European contact.
              </p>
              <p>
                The 19th century brought significant changes with the arrival of David Livingstone, whose expeditions opened the region to European influence. His efforts to end the slave trade and establish legitimate commerce had lasting impacts on the region.
              </p>
              <p>
                The colonial period under British rule as the Nyasaland Protectorate shaped modern boundaries and governance structures, but also sparked resistance movements that would eventually lead to independence in 1964 under Dr. Hastings Kamuzu Banda.
              </p>
              <p>
                Malawi's journey from one-party rule to multi-party democracy in the 1990s represents another important chapter in the nation's ongoing development, demonstrating the country's commitment to democratic principles and human rights.
              </p>
              <p>
                Throughout these historical periods, Malawians have maintained and adapted their cultural practices, creating a rich heritage that continues to inform national identity today.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default HistoryPage;
