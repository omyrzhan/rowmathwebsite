
<?php
// =======================
// Database connection
// =======================

$host = "sql206.infinityfree.com";
$user = "if0_40372786";
$pass = "Paranoik3691";
$db   = "if0_40372786_mathdb";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Database connection failed");
}

// =======================
// Handle form submission
// =======================

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $latex = trim($_POST["latex"]);

    if ($latex !== "") {
        $stmt = $conn->prepare("INSERT INTO mathproblem (latex) VALUES (?)");
        $stmt->bind_param("s", $latex);
        $stmt->execute();
        $stmt->close();

        $message = "Math problem saved successfully.";
    } else {
        $message = "Please enter a LaTeX expression.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Math Problem</title>

    <!-- MathJax for LaTeX rendering -->
    <script>
        window.MathJax = {
            tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] }
        };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <style>
        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #f5f5f5;
        }

        .container {
            max-width: 800px;
            margin: 30px auto;
            background: #fff;
            padding: 28px;
            border-radius: 12px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }

        h1 {
            margin-top: 0;
            text-align: center;
        }

        textarea {
            width: 100%;
            min-height: 140px;
            padding: 12px;
            font-size: 16px;
            font-family: monospace;
            box-sizing: border-box;
            border-radius: 8px;
            border: 1px solid #ccc;
        }

        button {
            margin-top: 14px;
            padding: 12px 22px;
            font-size: 16px;
            border: none;
            border-radius: 8px;
            background: #222;
            color: #fff;
            cursor: pointer;
        }

        button:hover {
            background: #444;
        }

        .message {
            margin-top: 14px;
            font-weight: bold;
        }

        .preview {
            margin-top: 24px;
            padding: 16px;
            background: #fafafa;
            border-radius: 8px;
            border: 1px solid #ddd;
        }

        .hint {
            font-size: 14px;
            color: #555;
            margin-bottom: 10px;
        }
    </style>
</head>

<body>

<div class="container">
    <h1>Add Math Problem (LaTeX)</h1>

    <div class="hint">
        Examples:<br>
        <code>\int_0^1 x^2 \, dx</code><br>
        <code>\begin{pmatrix}1 & 2 \\ 3 & 4\end{pmatrix}</code><br>
        <code>\sum_{n=1}^{\infty} \frac{1}{n^2}</code>
    </div>

    <form method="post">
        <textarea name="latex" placeholder="Enter LaTeX here..."><?= isset($_POST["latex"]) ? htmlspecialchars($_POST["latex"]) : "" ?></textarea>
        <button type="submit">Save Math Problem</button>
    </form>

    <?php if ($message): ?>
        <div class="message"><?= htmlspecialchars($message) ?></div>
    <?php endif; ?>

    <?php if (!empty($_POST["latex"])): ?>
        <div class="preview">
            <strong>Preview:</strong>
            <div>
                $$<?= htmlspecialchars($_POST["latex"]) ?>$$
            </div>
        </div>
    <?php endif; ?>
</div>

</body>
</html>
