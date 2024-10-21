import RevealCards from "../RevealCards";
import Cards from "./Card";
import "./home.css";
import { motion } from "framer-motion";

export default function Home() {
  const cards = [
    {
      title: "User Management",
      disc: "Efficiently manage user registration and authentication with role-based access for citizens, professionals, and administrators, ensuring secure and tailored experiences.",
    },
    {
      title: "Issue Reporting",
      disc: "Empower citizens to report civic issues easily and track their resolution status. Administrators can categorize and assign tasks to professionals for timely action.",
    },
    {
      title: "Task Assignment",
      disc: "Enable government officials to assign tasks to certified professionals, track progress, and prioritize issues to ensure effective resolution.",
    },
  ];

  return (
    <>
      <div className="flex flex-col justify-center items-center hero">
        <motion.div
          initial={{ opacity: 0, y: -300, scale: 0.4 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -400 }}
          transition={{ duration: 1.5, type: "spring" }}
          className="background flex justify-center"
        >
        </motion.div>
      </div>

      <div className="flex flex-col justify-center items-center mt-20 space-y-8">
        {cards.map((card, index) => (
          <RevealCards key={index}>
            <Cards
              even={index % 2 !== 0}
              title={card.title}
              disc={card.disc}
            />
          </RevealCards>
        ))}
      </div>
    </>
  );
}
