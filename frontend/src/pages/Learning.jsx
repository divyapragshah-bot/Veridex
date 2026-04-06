import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, AlertTriangle, CheckCircle, Eye } from 'lucide-react'

const modules = [
  {
    title: 'What is Phishing?',
    color: '#00d4ff',
    content: `Phishing is a type of social engineering attack where cybercriminals impersonate legitimate organizations to trick victims into revealing sensitive information like passwords, credit card numbers, or personal data.

Phishing attacks typically arrive via email, SMS (smishing), or phone calls (vishing) and often create a sense of urgency or fear to pressure victims into acting without thinking.

Key goal: Steal credentials, install malware, or commit financial fraud.`,
  },
  {
    title: 'URL Red Flags',
    color: '#8b5cf6',
    content: `🔴 IP address in URL (e.g. http://192.168.1.1/login) — no legitimate business uses a raw IP
🔴 Misspelled domain (paypa1.com, g00gle.com) — IDN homograph attacks
🔴 Suspicious TLD (.tk, .ml, .ga, .xyz) — free domains favored by phishers
🔴 HTTP instead of HTTPS — no encryption = no security
🔴 Excessive hyphens (paypal-secure-login-verify.com) — common pattern
🔴 URL shorteners (bit.ly, tinyurl) — hides the real destination
🔴 Overly long URLs — designed to confuse and hide the real domain
🟢 Always hover over links before clicking to preview the real URL`,
  },
  {
    title: 'Email Red Flags',
    color: '#ec4899',
    content: `🔴 Generic greetings ("Dear Customer") — legitimate services use your name
🔴 Urgency language ("Act NOW or your account will be closed!")
🔴 Threats ("Legal action will be taken in 24 hours")
🔴 Requests for credentials via email — no legitimate company does this
🔴 Mismatched sender email (support@paypal.com becomes support@paypal-helpdesk.xyz)
🔴 Asking for gift cards, wire transfers, or Bitcoin — always a scam
🔴 Poor grammar or spelling — automated translations often have errors
🟢 When in doubt, navigate directly to the company's official website`,
  },
  {
    title: 'Social Engineering Tactics',
    color: '#ffaa00',
    content: `Phishers are psychologists, not just hackers. They exploit:

Authority — impersonating banks, government agencies (IRS, FBI), or tech companies
Fear — account suspension, legal threats, security breaches
Urgency — artificial time pressure to prevent careful thinking
Greed — prizes, free gifts, "you've been selected"
Curiosity — "See who viewed your profile", interesting news headlines
Scarcity — "Limited time offer" or "Only 3 spots left"

Defense: Slow down. Verify independently. Call the organization directly using a number from their official website.`,
  },
  {
    title: 'Spear Phishing & Whaling',
    color: '#00ff88',
    content: `Standard phishing casts a wide net. Advanced attacks are targeted:

Spear Phishing: Targeted attacks using personal info (name, job, colleagues) gathered from LinkedIn, social media, or data breaches. Far more convincing.

Whaling: Targets high-value individuals — CEOs, CFOs, executives. Often impersonates the board of directors or major clients.

Business Email Compromise (BEC): Hacks or spoofs a real business email to request fraudulent wire transfers. Costs businesses billions per year.

Defense: Verify any unusual financial requests via phone. Use MFA. Train all staff.`,
  },
  {
    title: 'How to Protect Yourself',
    color: '#00d4ff',
    content: `✅ Enable Multi-Factor Authentication (MFA) on all accounts — even if credentials leak, attackers can't log in
✅ Use a password manager — never reuse passwords
✅ Verify URLs before clicking — hover, inspect, use Veridex!
✅ Never enter credentials through email links — go directly to the site
✅ Keep software updated — patches fix known vulnerabilities
✅ Use an email filter — Gmail, Outlook have built-in phishing detection
✅ Report suspicious emails — helps protect others
✅ When in doubt, call the organization directly using an official number`,
  },
]

function Module({ mod, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card-cyber overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-700"
            style={{ background: `${mod.color}15`, color: mod.color, border: `1px solid ${mod.color}30` }}>
            {index + 1}
          </div>
          <span className="font-display font-600 text-white">{mod.title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 pt-0 border-t border-white/5">
              <pre className="text-slate-400 text-sm font-body whitespace-pre-wrap leading-loose pt-4">{mod.content}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const quiz = [
  { q: 'You receive an email from "PayPal Support" asking you to click a link and verify your password. What do you do?', options: ['Click the link and verify', 'Ignore and delete', 'Log into PayPal directly by typing the URL in your browser', 'Reply asking if it\'s real'], answer: 2, explain: 'Always navigate directly to the official website — never click email links for security matters.' },
  { q: 'Which URL is most suspicious?', options: ['https://google.com/maps', 'http://paypal-secure-verify.tk/login', 'https://amazon.com/orders', 'https://github.com/login'], answer: 1, explain: 'HTTP + .tk domain + paypal in subdomain + /login path = textbook phishing URL.' },
  { q: 'A caller claims to be from Microsoft and says your computer has a virus. They ask for remote access. What do you do?', options: ['Give them access', 'Ask for their employee ID', 'Hang up — Microsoft never cold-calls about viruses', 'Call back the number they give you'], answer: 2, explain: 'Microsoft and other tech companies never cold-call users about viruses. This is a well-known support scam.' },
]

export default function Learning() {
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState({})

  const handleAnswer = (qi, oi) => {
    if (answers[qi] !== undefined) return
    setAnswers(a => ({ ...a, [qi]: oi }))
    setTimeout(() => setRevealed(r => ({ ...r, [qi]: true })), 500)
  }

  return (
    <div className="relative z-10 min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan text-xs font-mono mb-5">
            <BookOpen className="w-3.5 h-3.5" /> Phishing Awareness Hub
          </div>
          <h1 className="font-display font-800 text-4xl text-white mb-3">Learn to Spot Phishing</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Six interactive modules covering everything from basic phishing to advanced spear phishing. Test your knowledge with our quiz.</p>
        </motion.div>

        {/* Modules */}
        <div className="space-y-3">
          {modules.map((mod, i) => <Module key={mod.title} mod={mod} index={i} />)}
        </div>

        {/* Quiz */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="text-center">
            <h2 className="font-display font-700 text-2xl text-white mb-2">Quick Quiz</h2>
            <p className="text-slate-600 text-sm font-mono">Test your phishing awareness</p>
          </div>
          {quiz.map((q, qi) => (
            <div key={qi} className="card-cyber p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-cyber-cyan font-mono text-sm flex-shrink-0 mt-0.5">Q{qi + 1}.</span>
                <p className="text-white text-sm leading-relaxed">{q.q}</p>
              </div>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const chosen = answers[qi] === oi
                  const correct = oi === q.answer
                  const showResult = revealed[qi]
                  let cls = 'border border-white/10 text-slate-400 hover:border-cyber-cyan/30 hover:text-white'
                  if (showResult && correct) cls = 'border-green-500/50 bg-green-500/10 text-green-300'
                  else if (showResult && chosen && !correct) cls = 'border-red-500/50 bg-red-500/10 text-red-300'
                  else if (chosen && !showResult) cls = 'border-cyber-cyan/50 bg-cyber-cyan/10 text-cyber-cyan'
                  return (
                    <button key={oi} onClick={() => handleAnswer(qi, oi)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 ${cls}`}>
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                      {showResult && correct && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
                      {showResult && chosen && !correct && <AlertTriangle className="w-4 h-4 text-red-400 ml-auto" />}
                    </button>
                  )
                })}
              </div>
              <AnimatePresence>
                {revealed[qi] && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 text-sm bg-cyber-cyan/5 border border-cyber-cyan/20 rounded-xl px-4 py-3">
                    <Eye className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
                    <p className="text-slate-400">{q.explain}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
