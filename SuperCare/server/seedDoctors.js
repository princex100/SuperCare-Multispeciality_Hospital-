import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// ─── Connect ──────────────────────────────────────────────────
await mongoose.connect(`${process.env.MONGODB_URI}/SuperCare-Hospital`);
console.log("✅ Connected to MongoDB");

// ─── Doctor Schema (must match server model) ──────────────────
const doctorSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  image:       { type: String, required: true },
  speciality:  { type: String, required: true },
  degree:      { type: String, required: true },
  experience:  { type: String, required: true },
  about:       { type: String, required: true },
  available:   { type: Boolean, default: true },
  fees:        { type: Number, required: true },
  slots_booked:{ type: Object, default: {} },
  address:     { type: Object, required: true },
  date:        { type: Number, required: true },
}, { minimize: false });

const Doctor = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

// ─── Default hashed password for all seed doctors ─────────────
const hashedPassword = await bcrypt.hash("Doctor@1234", 10);

// ─── 21 Doctors — 3–4 per specialty ──────────────────────────
const doctors = [

  // ── General Physician (4) ────────────────────────────────
  {
    name: "Dr. Arjun Mehta",
    email: "arjun.mehta@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    speciality: "General physician",
    degree: "MBBS, MD (Internal Medicine)",
    experience: "12",
    about: "Dr. Arjun Mehta is a seasoned general physician with over 12 years of experience in diagnosing and treating a wide range of acute and chronic conditions. He is known for his patient-first approach and thorough clinical assessments.",
    available: true,
    fees: 500,
    slots_booked: {},
    address: { line1: "12, Rajpur Road", line2: "Dehradun, Uttarakhand" },
    date: Date.now(),
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    speciality: "General physician",
    degree: "MBBS, DNB (Family Medicine)",
    experience: "8",
    about: "Dr. Priya Sharma specialises in family medicine and preventive healthcare. With 8 years of clinical practice, she excels at managing diabetes, hypertension, and lifestyle diseases with compassionate care.",
    available: true,
    fees: 400,
    slots_booked: {},
    address: { line1: "45, Civil Lines", line2: "Jaipur, Rajasthan" },
    date: Date.now(),
  },
  {
    name: "Dr. Rakesh Verma",
    email: "rakesh.verma@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    speciality: "General physician",
    degree: "MBBS, MD (General Medicine)",
    experience: "15",
    about: "Dr. Rakesh Verma brings 15 years of rich experience in general medicine. He is proficient in managing infectious diseases, respiratory conditions, and metabolic disorders with evidence-based treatment protocols.",
    available: true,
    fees: 600,
    slots_booked: {},
    address: { line1: "7, Connaught Place", line2: "New Delhi" },
    date: Date.now(),
  },
  {
    name: "Dr. Sunita Rao",
    email: "sunita.rao@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    speciality: "General physician",
    degree: "MBBS, DGO",
    experience: "10",
    about: "Dr. Sunita Rao is a dedicated general physician with 10 years of experience. She takes a holistic approach to patient health, focusing on preventive care, early diagnosis, and personalised treatment plans.",
    available: false,
    fees: 450,
    slots_booked: {},
    address: { line1: "22, MG Road", line2: "Pune, Maharashtra" },
    date: Date.now(),
  },

  // ── Gynecologist (4) ─────────────────────────────────────
  {
    name: "Dr. Kavya Nair",
    email: "kavya.nair@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    speciality: "Gynecologist",
    degree: "MBBS, MS (Obstetrics & Gynaecology)",
    experience: "14",
    about: "Dr. Kavya Nair is a highly skilled gynaecologist and obstetrician with 14 years of experience. She specialises in high-risk pregnancies, laparoscopic surgeries, and women's reproductive health.",
    available: true,
    fees: 700,
    slots_booked: {},
    address: { line1: "10, Banjara Hills", line2: "Hyderabad, Telangana" },
    date: Date.now(),
  },
  {
    name: "Dr. Meena Iyer",
    email: "meena.iyer@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/35.jpg",
    speciality: "Gynecologist",
    degree: "MBBS, DGO, FRCOG",
    experience: "18",
    about: "Dr. Meena Iyer is a renowned consultant gynaecologist with 18 years of experience. She is an expert in infertility treatments, PCOS management, and minimally invasive gynaecological procedures.",
    available: true,
    fees: 900,
    slots_booked: {},
    address: { line1: "34, Indiranagar", line2: "Bengaluru, Karnataka" },
    date: Date.now(),
  },
  {
    name: "Dr. Pooja Desai",
    email: "pooja.desai@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/52.jpg",
    speciality: "Gynecologist",
    degree: "MBBS, MD (Obstetrics)",
    experience: "9",
    about: "Dr. Pooja Desai is a compassionate gynaecologist with 9 years of clinical experience. She focuses on maternal-foetal medicine, prenatal care, and adolescent gynaecology.",
    available: true,
    fees: 600,
    slots_booked: {},
    address: { line1: "56, Satellite Road", line2: "Ahmedabad, Gujarat" },
    date: Date.now(),
  },
  {
    name: "Dr. Ananya Krishnan",
    email: "ananya.krishnan@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/60.jpg",
    speciality: "Gynecologist",
    degree: "MBBS, DNB (Gynaecology)",
    experience: "7",
    about: "Dr. Ananya Krishnan specialises in women's health with a focus on menstrual disorders, endometriosis, and fertility counselling. She is known for her patient-centric and empathetic consultation style.",
    available: false,
    fees: 550,
    slots_booked: {},
    address: { line1: "18, Anna Salai", line2: "Chennai, Tamil Nadu" },
    date: Date.now(),
  },

  // ── Dermatologist (3) ────────────────────────────────────
  {
    name: "Dr. Rahul Singhania",
    email: "rahul.singhania@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    speciality: "Dermatologist",
    degree: "MBBS, MD (Dermatology)",
    experience: "11",
    about: "Dr. Rahul Singhania is a leading dermatologist with 11 years of expertise in treating acne, psoriasis, eczema, and performing advanced aesthetic skin procedures including laser therapy.",
    available: true,
    fees: 650,
    slots_booked: {},
    address: { line1: "9, Koregaon Park", line2: "Pune, Maharashtra" },
    date: Date.now(),
  },
  {
    name: "Dr. Shruti Patel",
    email: "shruti.patel@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/29.jpg",
    speciality: "Dermatologist",
    degree: "MBBS, DVD, DDVL",
    experience: "6",
    about: "Dr. Shruti Patel is a certified dermatologist and venereologist specialising in cosmetic dermatology, hair loss treatments, and chemical peels. She brings a modern approach to skin healthcare.",
    available: true,
    fees: 500,
    slots_booked: {},
    address: { line1: "3, FC Road", line2: "Pune, Maharashtra" },
    date: Date.now(),
  },
  {
    name: "Dr. Vikram Chatterjee",
    email: "vikram.chatterjee@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    speciality: "Dermatologist",
    degree: "MBBS, MD (Skin & VD)",
    experience: "13",
    about: "Dr. Vikram Chatterjee has 13 years of experience in clinical and cosmetic dermatology. He specialises in the diagnosis and management of autoimmune skin conditions, vitiligo, and skin cancers.",
    available: true,
    fees: 750,
    slots_booked: {},
    address: { line1: "5, Park Street", line2: "Kolkata, West Bengal" },
    date: Date.now(),
  },

  // ── Pediatricians (3) ────────────────────────────────────
  {
    name: "Dr. Neha Agarwal",
    email: "neha.agarwal@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    speciality: "Pediatricians",
    degree: "MBBS, MD (Paediatrics)",
    experience: "9",
    about: "Dr. Neha Agarwal is a dedicated paediatrician with 9 years of experience in neonatal care, child development, and managing childhood illnesses. She creates a friendly environment that puts both kids and parents at ease.",
    available: true,
    fees: 500,
    slots_booked: {},
    address: { line1: "11, Hazratganj", line2: "Lucknow, Uttar Pradesh" },
    date: Date.now(),
  },
  {
    name: "Dr. Sameer Joshi",
    email: "sameer.joshi@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/men/38.jpg",
    speciality: "Pediatricians",
    degree: "MBBS, DCH, DNB (Paediatrics)",
    experience: "16",
    about: "Dr. Sameer Joshi is a highly experienced paediatrician with 16 years of practice. He specialises in paediatric respiratory diseases, childhood obesity, and developmental disorders.",
    available: true,
    fees: 700,
    slots_booked: {},
    address: { line1: "27, SB Marg", line2: "Mumbai, Maharashtra" },
    date: Date.now(),
  },
  {
    name: "Dr. Lalita Reddy",
    email: "lalita.reddy@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/73.jpg",
    speciality: "Pediatricians",
    degree: "MBBS, MD (Child Health)",
    experience: "5",
    about: "Dr. Lalita Reddy is a passionate paediatrician focused on immunisation schedules, growth monitoring, and adolescent health. She is loved by her young patients for her gentle and cheerful demeanour.",
    available: false,
    fees: 450,
    slots_booked: {},
    address: { line1: "4, Jubilee Hills", line2: "Hyderabad, Telangana" },
    date: Date.now(),
  },

  // ── Neurologist (3) ──────────────────────────────────────
  {
    name: "Dr. Aditya Kapoor",
    email: "aditya.kapoor@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/men/71.jpg",
    speciality: "Neurologist",
    degree: "MBBS, MD, DM (Neurology)",
    experience: "17",
    about: "Dr. Aditya Kapoor is a senior consultant neurologist with 17 years of expertise in epilepsy, stroke management, Parkinson's disease, and multiple sclerosis. He is affiliated with several premier neurological institutes.",
    available: true,
    fees: 1000,
    slots_booked: {},
    address: { line1: "6, Shyam Nagar", line2: "Jaipur, Rajasthan" },
    date: Date.now(),
  },
  {
    name: "Dr. Ritu Malhotra",
    email: "ritu.malhotra@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/39.jpg",
    speciality: "Neurologist",
    degree: "MBBS, MD (Medicine), DM (Neurology)",
    experience: "12",
    about: "Dr. Ritu Malhotra is a consultant neurologist specialising in headache disorders, dementia, and neuro-rehabilitation. With 12 years of experience, she combines clinical expertise with a compassionate approach.",
    available: true,
    fees: 900,
    slots_booked: {},
    address: { line1: "14, Vasant Kunj", line2: "New Delhi" },
    date: Date.now(),
  },
  {
    name: "Dr. Sanjay Menon",
    email: "sanjay.menon@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/men/49.jpg",
    speciality: "Neurologist",
    degree: "MBBS, MRCP, DM (Neurology)",
    experience: "20",
    about: "Dr. Sanjay Menon is a highly distinguished neurologist with 20 years of experience. He is a pioneer in interventional neurology, specialising in advanced stroke care, neuro-oncology, and deep brain stimulation.",
    available: true,
    fees: 1200,
    slots_booked: {},
    address: { line1: "1, MG Road", line2: "Bengaluru, Karnataka" },
    date: Date.now(),
  },

  // ── Gastroenterologist (4) ───────────────────────────────
  {
    name: "Dr. Harish Batra",
    email: "harish.batra@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    speciality: "Gastroenterologist",
    degree: "MBBS, MD, DM (Gastroenterology)",
    experience: "14",
    about: "Dr. Harish Batra is a leading gastroenterologist with 14 years of expertise in endoscopy, colonoscopy, liver diseases, and inflammatory bowel disease management.",
    available: true,
    fees: 800,
    slots_booked: {},
    address: { line1: "33, Lajpat Nagar", line2: "New Delhi" },
    date: Date.now(),
  },
  {
    name: "Dr. Swati Goswami",
    email: "swati.goswami@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/57.jpg",
    speciality: "Gastroenterologist",
    degree: "MBBS, MD (Medicine), DM (Gastroenterology)",
    experience: "11",
    about: "Dr. Swati Goswami specialises in hepatology and digestive disorders. With 11 years of experience, she is known for her expertise in managing chronic liver conditions, GERD, and pancreatic diseases.",
    available: true,
    fees: 750,
    slots_booked: {},
    address: { line1: "19, Lake View Road", line2: "Kolkata, West Bengal" },
    date: Date.now(),
  },
  {
    name: "Dr. Nikhil Tiwari",
    email: "nikhil.tiwari@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    speciality: "Gastroenterologist",
    degree: "MBBS, MS, MCh (GI Surgery)",
    experience: "8",
    about: "Dr. Nikhil Tiwari is a gastrointestinal surgeon with 8 years of experience in laparoscopic GI surgeries, colorectal procedures, and the management of peptic ulcer disease.",
    available: true,
    fees: 700,
    slots_booked: {},
    address: { line1: "8, Arera Colony", line2: "Bhopal, Madhya Pradesh" },
    date: Date.now(),
  },
  {
    name: "Dr. Divya Kulkarni",
    email: "divya.kulkarni@supercare.in",
    password: hashedPassword,
    image: "https://randomuser.me/api/portraits/women/64.jpg",
    speciality: "Gastroenterologist",
    degree: "MBBS, MD, Fellowship (Hepatology)",
    experience: "6",
    about: "Dr. Divya Kulkarni is a young and dynamic gastroenterologist with a fellowship in hepatology. She focuses on viral hepatitis, fatty liver disease, and advanced endoscopic procedures.",
    available: false,
    fees: 600,
    slots_booked: {},
    address: { line1: "25, Kothrud", line2: "Pune, Maharashtra" },
    date: Date.now(),
  },
];

// ─── Insert ───────────────────────────────────────────────────
console.log(`\n📋 Inserting ${doctors.length} doctors...\n`);

let inserted = 0;
let skipped  = 0;

for (const doc of doctors) {
  try {
    await Doctor.create(doc);
    console.log(`  ✅  ${doc.name} (${doc.speciality})`);
    inserted++;
  } catch (err) {
    if (err.code === 11000) {
      console.log(`  ⚠️  Skipped (already exists): ${doc.name}`);
      skipped++;
    } else {
      console.error(`  ❌  Failed: ${doc.name} — ${err.message}`);
    }
  }
}

console.log(`\n🎉 Done! ${inserted} inserted, ${skipped} skipped.`);
await mongoose.disconnect();
process.exit(0);
