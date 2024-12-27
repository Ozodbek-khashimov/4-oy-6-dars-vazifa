import express from "express";

const app = express();

const port = 3000;

let users = [];
let blogs = [];

app.use(express.json());

app.post("/users/register", (req, res) => {
    const { username, password, fullname, age, email, gender } = req.body;

    if (!username || username.length < 3)
        return res.status(400).json({ error: "username kamida 3 ta belgidan iborat bo'lishi kerak." });

    if (!password || password.length < 5)
        return res.status(400).json({ error: "password kamida 5 ta belgidan iborat bo'lishi kerak." });

    if (age < 10) return res.status(400).json({ error: "yoshi kamida 10 yosh bo'lishi kerak." });

    if (!email) return res.status(400).json({ error: "Email kiritilishi shart." });

    if (users.some((user) => user.username === username))
        return res.status(400).json({ error: "Bu username allaqachon mavjud." });

    const newUser = {
        id: users.length + 1,
        username,
        password,
        fullname,
        age,
        email,
        gender
    };
    users.push(newUser);
    res.status(201).json({ message: "Foydalanuvchi muvaffaqiyatli qo'shildi!", user: newUser });
});

app.get("/users/profile/:identifier", (req, res) => {
    const { identifier } = req.params;

    const user = users.find((user) => user.username === identifier || user.email === identifier);

    if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi." });

    return res.status(200).json(user);
});

app.put("/users/profile/:identifier", (req, res) => {
    const { identifier } = req.params;
    const { fullname, age, gender } = req.body;

    const user = users.find((user) => user.username === identifier || user.email === identifier);

    if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi." });

    if (fullname && fullname.length >= 10) user.fullname = fullname;
    if (age && age >= 10) user.age = age;
    if (gender === "male" || gender === "female") user.gender = gender;

    res.status(200).json({ message: "Profil muvaffaqiyatli yangilandi!" });
});

app.delete("/users/profile/:identifier", (req, res) => {
    const { identifier } = req.params;

    const userIndex = users.findIndex((user) => user.username === identifier || user.email === identifier);

    if (userIndex === -1) return res.status(404).json({ error: "Foydalanuvchi topilmadi." });

    users.splice(userIndex, 1);
    res.status(200).json({ message: "Profil muvaffaqiyatli o'chirildi!" });
});

app.post("/blogs", (req, res) => {
    const { title, content, tags } = req.body;

    if (!title || !content) return res.status(400).json({ error: "Title va content kiritilishi shart." });

    const newBlog = {
        id: blogs.length + 1,
        title,
        content,
        tags,
        comments: [],
    };
    blogs.push(newBlog);
    res.status(201).json({ message: "Blog muvaffaqiyatli yaratildi!", blog: newBlog });
});

app.get("/blogs", (req, res) => {
    res.status(200).json(blogs);
});

app.put("/blogs/:id", (req, res) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const blog = blogs.find((blog) => blog.id == id);

    if (!blog) return res.status(404).json({ error: "Blog topilmadi." });

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (tags) blog.tags = tags;

    res.status(200).json({ message: "Blog muvaffaqiyatli yangilandi!" });
});

app.delete("/blogs/:id", (req, res) => {
    const { id } = req.params;

    const blogIndex = blogs.findIndex((blog) => blog.id == id);

    if (blogIndex === -1) return res.status(404).json({ error: "Blog topilmadi." });

    blogs.splice(blogIndex, 1);
    res.status(200).json({ message: "Blog muvaffaqiyatli o'chirildi!" });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
