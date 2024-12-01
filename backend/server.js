require("dotenv").config();
const express = require("express");
const db = require("./knex");
const cors = require("cors");
const path = require("path");
const app = express();

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

app.use(express.static(path.join(__dirname, "../frontend/dist")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}/`);
});

const ORIGIN_URL = process.env.ORIGIN_URL || process.env.VITE_LOCALHOST;

app.use(
  cors({
    origin: ORIGIN_URL, //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  }),
);

app.use(express.json());

// プロキシ設定 Render環境では必要。session idが保存されないので設定
app.set("trust proxy", true);

// 認証機能 ====================================================
// セッション設定 express-session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 有効期限設定 1日
      secure: process.env.NODE_ENV === "production", // true->httpsのみを許可、localはhttpなので切り替え
      httpOnly: true, // javascriptからのアクセスを防ぐ
    },
  }),
);

// passport session
app.use(passport.initialize());
app.use(passport.session());

// LocalStrategy(ユーザー名・パスワードでの認証)の設定
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await findUser(username);
    if (user.hashed_password === undefined) {
      // ユーザーが見つからない場合
      return done(null, false);
    }
    // ハッシュ化したPWの突き合わせ。入力されたpasswordから、DBに保存されたハッシュ値を比較する
    const match = await bcrypt.compare(password, user.hashed_password);
    if (match) {
      return done(null, user); // ログイン成功
    } else {
      return done(null, false); // ログイン失敗
    }
  }),
);

// 認証に成功した時にsessionにusernameを保存するための記述
passport.serializeUser((user, done) => done(null, user.username));
// sessionからuserを取り出して検証するための記述
passport.deserializeUser(async (username, done) => {
  const user = findUser(username);
  done(null, user);
});

// dbからユーザー情報を検索する関数
async function findUser(username) {
  const [foundUser] = await db("users").where({ username });
  return foundUser || {};
}

// 認証状態を確認するミドルウエア
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // 認証済みの場合、次のミドルウェアへ
  }
  res.status(401).json({ message: "ログインが必要です" });
}

// ログインエンドポイント
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "usernameとpasswordが必要です",
    });
  }

  // 最初に設定したLocalStrategy(ユーザー名とパスワードでの認証)を使ってログイン
  passport.authenticate("local", (err, user) => {
    if (!user) return res.status(401).json({ message: "ログイン失敗！" });

    // sessionにログイン情報を格納
    req.logIn(user, () => {
      return res.json({ message: `ログイン成功！ Hello, ${user.username}` });
    });
  })(req, res);
});

// サインアップ
async function signup(username, email, password) {
  const [newUsername] = await db("users")
    .insert({
      username,
      email,
      hashed_password: bcrypt.hashSync(password, 10), // パスワードをハッシュ化して保存
    })
    .returning("username");

  return newUsername;
}

app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      message: "usernameとpasswordが必要です",
    });
  } else {
    // usernameの重複check
    const user = await findUser(username);
    if (user.id) {
      res.status(400).json({
        message: "既に利用されているusernameです",
      });
    } else {
      const newUserName = await signup(username, email, password);
      res.json({
        message: "サインアップが完了しました",
        username: newUserName,
      });
    }
  }
});


// ログアウトエンドポイント
app.get("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // エラーハンドリングを適切に行う
    }

    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "セッション削除に失敗しました" });
      }
      res.clearCookie("connect.sid", {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });

      return res.json({ message: "ログアウト成功" });
    });
  });
});

// 認証状態を確認するためのエンドポイント
app.get("/api/auth_check", (req, res) => {
  // isAuthenticated() は認証状態をtrue,falseで返すメソッド
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

///////////////////////////////////////////////////

//全ユーザーのデータ取得
app.get("/api/users", checkAuth, async (req, res) => {
  const userData = await db.select("*").from("users");
  res.status(200).send(userData);
});