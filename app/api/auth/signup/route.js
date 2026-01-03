import dbConnect from "../../../../lib/connectDb";
import User from "../../../../models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, companyName, phone } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already in use" }), { status: 409, headers: { "Content-Type": "application/json" } });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const loginID = `${(name || "U").split(" ").map(s=>s[0]).join("").toUpperCase().slice(0,3)}${new Date().getFullYear()}${Math.floor(Math.random()*900+100)}`;

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "employee",
      companyName,
      phone,
      loginID,
    });

    return new Response(JSON.stringify({ ok: true, id: user._id }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
