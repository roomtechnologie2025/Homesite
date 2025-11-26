<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use RuntimeException;
use Throwable;

require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';
require_once __DIR__ . '/PHPMailer/src/Exception.php';

if (!function_exists('str_starts_with')) {
    function str_starts_with(string $haystack, string $needle): bool
    {
        return $needle === '' || strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}

if (!function_exists('str_ends_with')) {
    function str_ends_with(string $haystack, string $needle): bool
    {
        return $needle === '' || substr($haystack, -strlen($needle)) === $needle;
    }
}

if (!function_exists('str_contains')) {
    function str_contains(string $haystack, string $needle): bool
    {
        return $needle === '' || strpos($haystack, $needle) !== false;
    }
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (!function_exists('load_environment_variables')) {
    /**
     * Chargement simplifié d'un fichier .env (format KEY=VALUE)
     */
    function load_environment_variables(string $filePath): void
    {
        if (!is_file($filePath) || !is_readable($filePath)) {
            return;
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return;
        }

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            if ($key === '') {
                continue;
            }

            if ((str_starts_with($value, '"') && str_ends_with($value, '"'))
                || (str_starts_with($value, "'") && str_ends_with($value, "'"))
            ) {
                $value = substr($value, 1, -1);
            }

            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
            putenv(sprintf('%s=%s', $key, $value));
        }
    }
}

if (!function_exists('env')) {
    function env(string $key, ?string $default = null): ?string
    {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
        if ($value === false || $value === null || $value === '') {
            return $default;
        }

        return $value;
    }
}

load_environment_variables(__DIR__ . '/.env');
load_environment_variables(__DIR__ . '/../.env');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Méthode non autorisée.'
    ]);
    exit;
}

$rawInput = file_get_contents('php://input');
$payload = json_decode($rawInput ?? '', true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Format de données invalide.'
    ]);
    exit;
}

function clean_string(?string $value): string
{
    return trim((string)($value ?? ''));
}

$name = clean_string($payload['name'] ?? null);
$email = clean_string($payload['email'] ?? null);
$company = clean_string($payload['company'] ?? null);
$message = clean_string($payload['message'] ?? null);

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Merci de remplir au minimum votre nom, email et message.'
    ]);
    exit;
}

if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => "L'adresse email fournie n'est pas valide."
    ]);
    exit;
}

$timestamp = (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format(DateTimeInterface::ATOM);
$entry = [
    'name' => $name,
    'email' => $email,
    'company' => $company,
    'message' => $message,
    'timestamp' => $timestamp
];

/**
 * Stockage local (optionnel) pour vérification côté serveur.
 */
$storageDir = __DIR__ . '/storage';
$storageFile = $storageDir . '/contacts.json';

if (!is_dir($storageDir)) {
    mkdir($storageDir, 0775, true);
}

$existing = [];
if (file_exists($storageFile)) {
    $fileContent = file_get_contents($storageFile);
    if ($fileContent !== false) {
        $decoded = json_decode($fileContent, true);
        if (is_array($decoded)) {
            $existing = $decoded;
        }
    }
}

$existing[] = $entry;
file_put_contents($storageFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

/**
 * Préparation de l'email.
 */
$toAddress = env('CONTACT_TO_EMAIL', 'roomtechnologie2025@gmail.com');
$fromAddress = env('CONTACT_FROM_EMAIL', env('SMTP_USER', 'no-reply@roomtech.com'));
$fromName = env('CONTACT_FROM_NAME', 'RoomTech');
$subject = sprintf('Nouveau message de Contact de %s - RoomTech', $name);

$safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeCompany = htmlspecialchars($company !== '' ? $company : 'Non communiqué', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$formattedMessage = nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
$sentAt = htmlspecialchars($timestamp, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$htmlBody = <<<HTML
<div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f9fafb; padding:24px;">
  <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.1);">
    <tr>
      <td style="background:#000000; color:#FFD700; padding:24px 32px;">
        <h1 style="margin:0; font-size:24px; font-weight:700; color:#FFD700;">Nouveau message — Message de {$safeName}</h1>
        <p style="margin:8px 0 0; font-size:14px; opacity:0.9; color:#FFD700;">Réception via le formulaire RoomTech</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin:0 0 18px; color:#000000; font-size:16px; font-weight:600;">
          Bonjour,
        </p>
        <p style="margin:0 0 18px; color:#1f2937; font-size:16px; line-height:1.6;">
          Un nouveau message vient d'être reçu. Voici les informations transmises&nbsp;:
        </p>
        <div style="border:2px solid #FFD700; border-radius:12px; padding:18px 24px; background:#fffef5;">
          <p style="margin:0 0 12px; font-size:15px; color:#000000;">
            <strong style="color:#FFD700;">Nom :</strong> <span style="color:#1f2937;">{$safeName}</span>
          </p>
          <p style="margin:0 0 12px; font-size:15px; color:#000000;">
            <strong style="color:#FFD700;">Email :</strong> <a href="mailto:{$safeEmail}" style="color:#FFD700; text-decoration:none; font-weight:600;">{$safeEmail}</a>
          </p>
          <p style="margin:0 0 12px; font-size:15px; color:#000000;">
            <strong style="color:#FFD700;">Téléphone :</strong> <span style="color:#1f2937;">{$safeCompany}</span>
          </p>
          <p style="margin:0; font-size:15px; color:#000000;">
            <strong style="color:#FFD700;">Message :</strong><br />
            <span style="white-space:pre-line; color:#1f2937; margin-top:8px; display:block;">{$formattedMessage}</span>
          </p>
        </div>
        <p style="margin:24px 0 0; font-size:14px; color:#4b5563;">
          Merci de répondre sous 24h. À bientôt&nbsp;!
        </p>
        <p style="margin:16px 0 0; font-size:12px; color:#6b7280;">
          Envoyé le {$sentAt}
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#000000; padding:16px 32px; text-align:center;">
        <p style="margin:0; color:#FFD700; font-size:12px; font-weight:600;">
          © 2025 RoomTech — Tous droits réservés
        </p>
      </td>
    </tr>
  </table>
</div>
HTML;

$logFile = $storageDir . '/mail.log';
$mailDriver = strtolower(trim(env('CONTACT_MAIL_DRIVER', 'smtp')));
$mailSent = false;
$mailError = null;

if ($mailDriver === 'log') {
    $logEntry = [
        'to' => $toAddress,
        'subject' => $subject,
        'headers' => [
            sprintf('From: %s <%s>', $fromName, $fromAddress),
            sprintf('Reply-To: %s', $safeEmail),
            "MIME-Version: 1.0",
            "Content-Type: text/html; charset=UTF-8"
        ],
        'body' => $htmlBody,
        'timestamp' => $timestamp,
        'driver' => 'log'
    ];
    file_put_contents($logFile, json_encode($logEntry, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND);
    $mailSent = true;
} else {
    $smtpHost = env('SMTP_HOST');
    $smtpUser = env('SMTP_USER');
    $smtpPass = env('SMTP_PASS');
    $smtpPort = (int)env('SMTP_PORT', '587');
    $smtpSecureSetting = strtolower((string)env('SMTP_SECURE', 'tls'));

    $encryption = null;
    if (in_array($smtpSecureSetting, ['ssl', 'smtps', 'tls://', 'ssl://'], true) || $smtpPort === 465) {
        $encryption = PHPMailer::ENCRYPTION_SMTPS;
    } elseif (in_array($smtpSecureSetting, ['tls', 'starttls'], true)) {
        $encryption = PHPMailer::ENCRYPTION_STARTTLS;
    }

    try {
        if (!$smtpHost || !$smtpUser || !$smtpPass) {
            throw new RuntimeException('Configuration SMTP incomplète. Veuillez définir SMTP_HOST, SMTP_USER et SMTP_PASS.');
        }

        $mailer = new PHPMailer(true);
        $mailer->CharSet = 'UTF-8';
        $mailer->isSMTP();
        $mailer->Host = $smtpHost;
        $mailer->Port = $smtpPort;
        $mailer->SMTPAuth = true;
        $mailer->Username = $smtpUser;
        $mailer->Password = $smtpPass;

        if ($encryption !== null) {
            $mailer->SMTPSecure = $encryption;
        }

        $mailer->setFrom($fromAddress, $fromName ?: $fromAddress);
        $mailer->addReplyTo($safeEmail, $safeName ?: $safeEmail);
        $mailer->addAddress($toAddress);

        $mailer->isHTML(true);
        $mailer->Subject = $subject;
        $mailer->Body = $htmlBody;
        $mailer->AltBody = strip_tags(str_replace('<br />', PHP_EOL, $message));

        $mailer->send();
        $mailSent = true;
    } catch (Throwable $throwable) {
        $mailError = $throwable->getMessage();
        $logEntry = [
            'to' => $toAddress,
            'subject' => $subject,
            'headers' => [
                sprintf('From: %s <%s>', $fromName, $fromAddress),
                sprintf('Reply-To: %s', $safeEmail)
            ],
            'body' => $htmlBody,
            'timestamp' => $timestamp,
            'driver' => 'smtp',
            'error' => $mailError
        ];
        file_put_contents($logFile, json_encode($logEntry, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND);
    }
}

if (!$mailSent) {
    http_response_code(202);
}

echo json_encode([
    'success' => true,
    'message' => $mailSent
        ? 'Votre message a bien été reçu. Merci !'
        : 'Votre message a bien été reçu. (Notification email non envoyée, un administrateur a été averti.)',
    'smtp_error' => $mailError
]);

