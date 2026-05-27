import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// ─── Configure Cloudinary ─────────────────────────────────────
cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_SECRET_KEY,
});

// ─── Connect to MongoDB ───────────────────────────────────────
await mongoose.connect(`${process.env.MONGODB_URI}/SuperCare-Hospital`);
console.log("✅ Connected to MongoDB");

// ─── Doctor Schema ────────────────────────────────────────────
const doctorSchema = new mongoose.Schema({
  name:         String,
  email:        { type: String, unique: true },
  password:     String,
  image:        String,
  speciality:   String,
  degree:       String,
  experience:   String,
  about:        String,
  available:    Boolean,
  fees:         Number,
  slots_booked: { type: Object, default: {} },
  address:      Object,
  date:         Number,
}, { minimize: false });

const Doctor = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

// ─── Artifacts directory (where generated images are saved) ───
const artifactsDir = `C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\532689d2-834a-4feb-a7b0-6d6e23178e03`;

// ─── Upload each image to Cloudinary ─────────────────────────
console.log("\n📤 Uploading images to Cloudinary...\n");

const uploadImage = async (localFileName) => {
  // find file (may have timestamp suffix)
  const { default: fs } = await import("fs");
  const files = fs.readdirSync(artifactsDir).filter(f => f.startsWith(localFileName));
  if (!files.length) throw new Error(`No file found starting with: ${localFileName}`);
  const fullPath = path.join(artifactsDir, files[0]);
  const result = await cloudinary.uploader.upload(fullPath, {
    folder: "supercare/doctors",
    resource_type: "image",
  });
  console.log(`  ✅  Uploaded ${localFileName} → ${result.secure_url}`);
  return result.secure_url;
};

// Upload all 8 images
const [
  maleDoc1,   // Dr. Arjun Mehta style  - 40s confident
  femaleDoc1, // Dr. Priya Sharma style - 30s friendly
  maleDoc2,   // Dr. Rakesh Verma style - 30s scrubs
  femaleDoc2, // Dr. Sunita Rao style   - 40s wavy hair
  maleDoc3,   // Dr. Sameer Joshi style - 50s senior
  femaleDoc3, // Dr. Neha Agarwal style - late 20s cheerful
  maleDoc4,   // Dr. Harish Batra style - bearded 30s
  femaleDoc4, // Dr. Kavya Nair style   - dupatta bun
] = await Promise.all([
  uploadImage("indian_male_doctor_1"),
  uploadImage("indian_female_doctor_1"),
  uploadImage("indian_male_doctor_2"),
  uploadImage("indian_female_doctor_2"),
  uploadImage("indian_male_doctor_3"),
  uploadImage("indian_female_doctor_3"),
  uploadImage("indian_male_doctor_4"),
  uploadImage("indian_female_doctor_4"),
]);

// ─── Map doctor email → Cloudinary URL ───────────────────────
const imageMap = {
  // General Physician
  "arjun.mehta@supercare.in":    maleDoc1,
  "priya.sharma@supercare.in":   femaleDoc1,
  "rakesh.verma@supercare.in":   maleDoc2,
  "sunita.rao@supercare.in":     femaleDoc2,

  // Gynecologist
  "kavya.nair@supercare.in":     femaleDoc4,
  "meena.iyer@supercare.in":     femaleDoc2,
  "pooja.desai@supercare.in":    femaleDoc1,
  "ananya.krishnan@supercare.in":femaleDoc3,

  // Dermatologist
  "rahul.singhania@supercare.in":maleDoc1,
  "shruti.patel@supercare.in":   femaleDoc3,
  "vikram.chatterjee@supercare.in":maleDoc4,

  // Pediatricians
  "neha.agarwal@supercare.in":   femaleDoc3,
  "sameer.joshi@supercare.in":   maleDoc3,
  "lalita.reddy@supercare.in":   femaleDoc4,

  // Neurologist
  "aditya.kapoor@supercare.in":  maleDoc3,
  "ritu.malhotra@supercare.in":  femaleDoc2,
  "sanjay.menon@supercare.in":   maleDoc4,

  // Gastroenterologist
  "harish.batra@supercare.in":   maleDoc4,
  "swati.goswami@supercare.in":  femaleDoc2,
  "nikhil.tiwari@supercare.in":  maleDoc2,
  "divya.kulkarni@supercare.in": femaleDoc1,
};

// ─── Update MongoDB ───────────────────────────────────────────
console.log("\n📝 Updating doctor images in MongoDB...\n");

let updated = 0;
for (const [email, imageUrl] of Object.entries(imageMap)) {
  const result = await Doctor.updateOne({ email }, { $set: { image: imageUrl } });
  if (result.modifiedCount > 0) {
    console.log(`  ✅  Updated: ${email}`);
    updated++;
  } else {
    console.log(`  ⚠️  Not found: ${email}`);
  }
}

console.log(`\n🎉 Done! ${updated}/${Object.keys(imageMap).length} doctors updated with Indian photos.`);
await mongoose.disconnect();
process.exit(0);
