import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Updated data for tech timeline
const timelineEvents = [
  {
    year: "1980s",
    title: "Early Computing in Malawi",
    description: "Introduction of first mainframe computers in government and university systems. University of Malawi acquires its first computer lab with support from international donors."
  },
  {
    year: "1994",
    title: "First Internet Connection",
    description: "Malawi gets its first internet connection through the University of Malawi, marking the beginning of the digital age. Speeds were extremely slow by today's standards (dial-up connections)."
  },
  {
    year: "2000",
    title: "Mobile Networks Launch",
    description: "Telekom Networks Malawi (TNM) becomes the first mobile network operator, bringing GSM technology to the country. This revolutionized communication, leapfrogging fixed-line infrastructure."
  },
  {
    year: "2003",
    title: "MALAWI Online Project",
    description: "Government initiative to connect ministries and improve e-governance. First major attempt at digitizing government services and records."
  },
  {
    year: "2010",
    title: "Fiber Optic Backbone",
    description: "Completion of the national fiber optic backbone project, significantly improving internet speeds and reliability. This enabled more businesses to go online."
  },
  {
    year: "2013",
    title: "Mobile Money Revolution",
    description: "Airtel Money and TNM Mpamba launch, transforming financial inclusion. By 2020, over 40% of adults were using mobile money services regularly."
  },
  {
    year: "2019",
    title: "National ICT Policy",
    description: "Government adopts comprehensive ICT policy framework to guide digital transformation across all sectors of the economy."
  },
  {
    year: "2020",
    title: "COVID-19 Digital Acceleration",
    description: "Pandemic drives rapid adoption of digital tools - telehealth, e-learning, and remote work solutions see unprecedented growth."
  },
  {
    year: "2022",
    title: "5G Trials Begin",
    description: "Telecom companies begin testing 5G networks in major cities, positioning Malawi for next-generation connectivity."
  }
];

// Updated cultural facts with tech focus
const culturalFacts = [
  {
    title: "Tech Hubs & Innovation",
    description: "Malawi has seen growth in tech hubs like mHub, Design Lab, and Kumvana supporting local startups. These spaces foster collaboration between young tech entrepreneurs."
  },
  {
    title: "Digital Payments Culture",
    description: "Malawi has embraced mobile money more than traditional banking, with over 7 million registered mobile money accounts serving a largely unbanked population."
  },
  {
    title: "Social Media Influence",
    description: "Platforms like WhatsApp and Facebook dominate digital communication, becoming crucial for business, news dissemination, and social interaction."
  },
  {
    title: "E-Learning Challenges",
    description: "While digital education tools are growing, access remains unequal with urban areas having better infrastructure than rural communities."
  },
  {
    title: "Local Content Creation",
    description: "A growing community of Malawian YouTubers, podcasters, and digital creators are telling local stories through technology."
  },
  {
    title: "Tech in Agriculture",
    description: "Farmers are increasingly using mobile apps for weather forecasts, market prices, and connecting with buyers, transforming the agricultural sector."
  }
];

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Malawi's Tech Evolution</h1>
            <p className="text-xl opacity-90">
              Journey through Malawi's digital transformation - from first computers to mobile revolutions and the growing startup ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="timeline" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="timeline">Tech Timeline</TabsTrigger>
              <TabsTrigger value="culture">Digital Culture</TabsTrigger>
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
                  <h2 className="text-3xl font-bold mb-6 text-green-800">Milestones in Malawian Tech</h2>
                  <p className="text-gray-700 mb-8">
                    From the first mainframes to mobile money and 5G trials, explore how technology has transformed Malawi's economy and society.
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
                  <h2 className="text-3xl font-bold mb-6 text-green-800">Digital Malawi</h2>
                  <p className="text-gray-700 mb-8">
                    How technology is reshaping daily life, business, and culture in the Warm Heart of Africa.
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
                    <h3 className="text-2xl font-bold mb-4 text-green-800">The Digital Warm Heart</h3>
                    <p className="text-gray-700 mb-4">
                      Malawi's famous hospitality has extended into the digital realm, with vibrant online communities supporting each other through tech challenges. Social media groups have become modern versions of village gatherings, where knowledge and resources are shared freely.
                    </p>
                    <p className="text-gray-700">
                      The tech community embodies the spirit of "Ubuntu" - "I am because we are" - with successful entrepreneurs actively mentoring the next generation of innovators through programs like mLab's accelerator initiatives.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="relative overflow-hidden rounded-lg h-64 mt-8">
                    <img className="w-full h-full object-cover" alt="Malawian tech entrepreneurs at work" src="/office.jpg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">Growing Tech Community</h3>
                        <p>Young Malawians are embracing technology careers, with coding bootcamps and digital skills training programs expanding opportunities.</p>
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
            <h2 className="text-3xl font-bold mb-6 text-center">Malawi's Tech Future</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Malawi's tech journey represents both remarkable progress and ongoing challenges. While urban centers like Blantyre and Lilongwe have relatively good connectivity, rural areas still face significant digital divides. The government's Digital Malawi Strategy aims to address these gaps through infrastructure development and digital literacy programs.
              </p>
              <p>
                The startup ecosystem, though young, shows promising growth with success stories like Agrikonnect (agricultural tech), Ujirani (neighborhood networking), and Thandizo (health tech). These homegrown solutions demonstrate Malawians' ability to develop technologies that address local challenges.
              </p>
              <p>
                Cybersecurity has emerged as a critical concern as digital adoption grows. The establishment of the Malawi National Computer Emergency Response Team (MW-CERT) in 2021 marked an important step in protecting the nation's digital infrastructure.
              </p>
              <p>
                Looking ahead, Malawi stands at a digital crossroads. With strategic investments in education infrastructure and supportive policies, the country could leverage technology to accelerate development across all sectors. The growing number of tech graduates and returning diaspora professionals with technical skills provide hope for Malawi's digital future.
              </p>
              <p>
                As global technologies like AI and blockchain mature, Malawi has the opportunity to adopt these tools in ways that leapfrog traditional development pathways, potentially creating innovative solutions tailored to the African context.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default HistoryPage;
