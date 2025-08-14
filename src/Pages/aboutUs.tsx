import Layout from "../App/Layout";

const teamMembers = [
  {
    name: "Ejaz Uddin Swaron",
    country: "Bangladesh",
    img: "/figma_photos/thePhoto-modified-reduced.png",
    desc: "Passionate developer with expertise in creating modern web applications.",
  },
  {
    name: "Shah Redwan Ahmed",
    country: "Bangladesh",
    img: "/figma_photos/redwan-bro-modified-reduced.png",
    desc: "Passionate developer with expertise in creating modern web applications.",
  },
  {
    name: "Iftikhar Majumder",
    country: "Bangladesh",
    img: "/figma_photos/ifty_bro_2-modified_reduced.png",
    desc: "Passionate developer with expertise in creating modern web applications.",
  },
  {
    name: "Mojjammel Hossain",
    country: "Bangladesh",
    img: "/figma_photos/mithil_bro-modified_reduced.png",
    desc: "Passionate developer with expertise in creating modern web applications.",
  },
  {
    name: "Abathi Arifeen",
    country: "Bangladesh",
    img: "/figma_photos/abtahi_bro-modified-reduced.png",
    desc: "Passionate developer with expertise in creating modern web applications.",
  },
];

const AboutUs: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-white text-primary-dark font-jakarta">
        {/* Hero Section */}
        <div className="relative h-72 flex items-center justify-center bg-primary-light">
          <div className="absolute inset-0 bg-primary-dark bg-opacity-60 flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
              Explore purposefully, Travel meaningfully, Feel at home anywhere.
            </h1>
            <p className="text-lg md:text-2xl text-accent-light text-center">
              Find Your Nest, Wander the World.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <section className="max-w-5xl mx-auto py-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, idx) => (
              <div
                className="bg-accent-light rounded-xl shadow-md flex flex-col items-center p-6"
                key={idx}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary"
                />
                <div className="text-center">
                  <h3 className="text-lg font-bold text-primary mb-1">
                    {member.name}
                  </h3>
                  <div className="text-sm text-primary-dark mb-2">
                    {member.country}
                  </div>
                  <div className="text-xs text-gray-600">{member.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutUs;
