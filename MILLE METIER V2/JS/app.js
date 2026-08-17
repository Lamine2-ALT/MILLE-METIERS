const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const MOUVEMENT_REDUIT = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const WA_NUMERO = "221772051466";

function lienWA(message) { return `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(message)}`; }

// 🔥 VOTRE URL GOOGLE APPS SCRIPT
const URL_GOOGLE_SHEET = "https://script.google.com/macros/s/AKfycbxwMjKpl-Kxk1FNvrSDJQL31m3vnatAkeONxPalYu_3rcYyAEcMybqOfpqNPl0jRDwp/exec";

async function envoyerDonnees(donnees) {
  if (!URL_GOOGLE_SHEET) return;
  try {
    await fetch(URL_GOOGLE_SHEET, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(donnees) });
  } catch (err) { console.warn("Envoi Sheets impossible :", err); }
}

const METIERS = [
  { id: "plombier", nom: "Plombier", icone: "🚿", cat: "prestation", desc: "Fuites, robinets" },
  { id: "electricien", nom: "Électricien", icone: "⚡", cat: "prestation", desc: "Câblage, pannes" },
  { id: "menuisier", nom: "Menuisier", icone: "🪚", cat: "prestation", desc: "Meubles, bois" },
  { id: "macon", nom: "Maçon", icone: "🧱", cat: "prestation", desc: "Construction" },
  { id: "peintre", nom: "Peintre", icone: "🎨", cat: "prestation", desc: "Peinture bâtiment" },
  { id: "carreleur", nom: "Carreleur", icone: "📐", cat: "prestation", desc: "Pose de carreaux" },
  { id: "mecanicien", nom: "Mécanicien", icone: "🔧", cat: "prestation", desc: "Autos, motos" },
  { id: "climatisation", nom: "Climatisation", icone: "❄️", cat: "prestation", desc: "Installation, dépannage" },
  { id: "coiffeur", nom: "Coiffeur", icone: "💇", cat: "prestation", desc: "Coiffure à domicile" },
  { id: "jardinier", nom: "Jardinier", icone: "🌿", cat: "prestation", desc: "Entretien espaces verts" },
  { id: "reparateur", nom: "Réparateur", icone: "🛠️", cat: "prestation", desc: "Électroménager" },
  { id: "nounou", nom: "Nounou", icone: "👶", cat: "placement", desc: "Garde d'enfants" },
  { id: "aide-menagere", nom: "Aide-ménagère", icone: "🧹", cat: "placement", desc: "Ménage, entretien" },
  { id: "gardien", nom: "Gardien", icone: "🛡️", cat: "placement", desc: "Surveillance" },
  { id: "chauffeur", nom: "Chauffeur", icone: "🚗", cat: "placement", desc: "Conduite" },
  { id: "cuisinier", nom: "Cuisinier", icone: "🍲", cat: "placement", desc: "Repas, cuisine" }
];

const VILLES = ["Dakar", "Pikine", "Thiès", "Mbour", "Saint-Louis", "Rufisque", "Kaolack", "Ziguinchor"];

const PROS = [
  { nom: "Fatou Ndiaye", telephone: "771112233", metier: "nounou", skills: ["nounou", "repassage", "cuisine"], ville: "Dakar", quartier: "Almadies", dispo: true, note: 5.0, exp: 5, badge: "Top avis", complementSkill: "Repassage & ménage" },
  { nom: "Oumar Diop", telephone: "774445566", metier: "plombier", skills: ["plombier"], ville: "Dakar", quartier: "Parcelles", dispo: true, note: 4.8, missions: 12 },
  { nom: "Moussa Fall", telephone: "773456703", metier: "electricien", skills: ["electricien"], ville: "Thiès", quartier: "Centre", dispo: true, note: 4.5, missions: 28 },
  { nom: "Ouleye Fall", telephone: "778876874", metier: "nounou", skills: ["nounou", "cuisine", "menage"], ville: "Dakar", quartier: " ", dispo: true, note: 5.0, exp: 5, badge: "Top avis", complementSkill: "caissière vendeuse" },
  { nom: "Esda OVA", telephone: "781098629", metier: "nounou", skills: ["nounou"], ville: "Dakar", quartier: " ", dispo: true, badge: "nouveau" }
];

const TEINTES = ["#0E5AA7", "#F0791F", "#17995F", "#8A5A2B"];

function initiales(nom) { return nom.split(" ").map((m) => m[0]).slice(0, 2).join("").toUpperCase(); }
function etoiles(note) { return "★".repeat(Math.round(note)) + "☆".repeat(5 - Math.round(note)); }
function nomMetier(id) { const m = METIERS.find((x) => x.id === id); return m ? m.nom : id; }

function compterDisponibles(metierId, ville) {
  return PROS.filter((p) => p.dispo && (!metierId || p.skills.includes(metierId) || p.metier === metierId) && (!ville || p.ville === ville)).length;
}

function montrerToast(message, type = "info") {
  const zone = $("#toasts");
  if(!zone) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  zone.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => { toast.classList.remove("visible"); setTimeout(() => toast.remove(), 400); }, 3800);
}

let prochaineModaleApresConditions = null;
function ouvrirModale(id) {
  fermerModales();
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add("ouverte");
  document.body.style.overflow = "hidden";
}
function fermerModales() {
  $$(".modale-fond.ouverte").forEach((m) => { m.classList.remove("ouverte"); });
  document.body.style.overflow = "";
  reinitialiserSucces();
}
function reinitialiserSucces() {
  [["#succes-prestation", "#corps-prestation"], ["#succes-placement", "#corps-placement"], ["#succes-pro", "#corps-pro"]].forEach(([s, c]) => {
    const succes = $(s), corps = $(c);
    if (succes && !succes.hidden) { succes.hidden = true; if (corps) corps.hidden = false; }
  });
  if ($("#pas-1") && !$("#pas-1").hidden) allerEtape(1, true);
}

$$(".modale-fermer").forEach((b) => b.addEventListener("click", fermerModales));
$$(".modale-fond").forEach((fond) => { fond.addEventListener("click", (e) => { if (e.target === fond) fermerModales(); }); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fermerModales(); });

function ouvrirModaleConditions(type) {
  prochaineModaleApresConditions = type;
  const contenu = $("#conditions-contenu");
  if (type === 'pro') {
    contenu.innerHTML = `<p><strong>Pour les professionnels :</strong></p><ul style="padding-left: 20px; margin-bottom: 15px;"><li>✅ L'inscription sur le site est <strong>100% gratuite</strong>.</li><li>💰 <strong>Prestation :</strong> Nous prenons <strong>5%</strong> du coût total de la prestation uniquement quand vous trouvez un client grâce à nous.</li><li>💰 <strong>Placement :</strong> Commission fixe de <strong>5 000 FCFA</strong> lors d'un recrutement réussi.</li></ul>`;
  } else {
    contenu.innerHTML = `<p><strong>Pour les clients :</strong></p><ul style="padding-left: 20px; margin-bottom: 15px;"><li>✅ Faire une demande ne vous coûte rien.</li><li>💰 <strong>Prestation :</strong> Frais de mise en relation de <strong>2 000 FCFA</strong> (payable uniquement si vous validez le professionnel qu'on vous propose).</li><li>💰 <strong>Placement :</strong> Frais de mise en relation de <strong>10 000 FCFA</strong> (payable uniquement lors de la validation du candidat).</li></ul>`;
  }
  ouvrirModale("modale-conditions");
}

const btnAccepter = $("#btn-accepter-conditions");
if (btnAccepter) {
  btnAccepter.addEventListener("click", () => {
    fermerModales();
    if (prochaineModaleApresConditions === 'pro') ouvrirModale("modale-pro");
    else if (prochaineModaleApresConditions === 'client_placement') ouvrirModale("modale-placement");
    else ouvrirPrestation();
    prochaineModaleApresConditions = null;
  });
}

function toggleAutreBesoin() {
  const container = $("#autre-besoin-container");
  const input = $("#champ-autre-besoin");
  const btn = $("#btn-autre-besoin");
  if (container.style.display === "none") {
    container.style.display = "block"; input.focus(); btn.innerHTML = "Annuler et choisir dans la liste";
    $$("#chips-metier .chip").forEach(c => c.classList.remove("act"));
    assistant.metier = "autre"; $("#suiv-1").disabled = false;
  } else {
    container.style.display = "none"; input.value = ""; btn.innerHTML = "✨ Mon besoin n'est pas dans la liste";
    assistant.metier = null; $("#suiv-1").disabled = true;
  }
}

function toggleAutreProfil(select) {
  const container = $("#autre-profil-container");
  const input = $("#pl-autre-type");
  if (select.value === "Autre") { container.style.display = "block"; input.required = true; input.focus(); } 
  else { container.style.display = "none"; input.required = false; input.value = ""; }
}

function toggleCustomSkill(checkbox) {
  const container = $("#custom-skill-container");
  const input = $("#pr-custom-skill");
  if (checkbox.checked) { container.style.display = "block"; input.required = true; input.focus(); } 
  else { container.style.display = "none"; input.required = false; input.value = ""; }
}

function rendreGrilleMetiers() {
  const grille = $("#grille-metiers");
  if (!grille) return;
  grille.innerHTML = METIERS.map((m) => {
    const n = compterDisponibles(m.id);
    return `<button class="carte-metier" data-metier="${m.id}"><span class="tuile-icone tuile-bleue">${m.icone}</span><strong>${m.nom}</strong><small>${m.desc}</small><span class="dispo-metier ${n > 0 ? "oui" : "non"}">${n > 0 ? `● ${n} dispo` : "○ Sur demande"}</span></button>`;
  }).join("");
  grille.addEventListener("click", (e) => {
    const carte = e.target.closest(".carte-metier");
    if (!carte) return;
    filtrerDepuisMetier(carte.dataset.metier);
  });
}

function filtrerDepuisMetier(metierId) {
  const filtre = $("#filtre-metier");
  if (filtre) filtre.value = metierId;
  const dispo = $("#filtre-dispo");
  if (dispo) dispo.checked = false;
  rendrePros();
  const sectionPros = document.getElementById("professionnels");
  if (sectionPros) sectionPros.scrollIntoView({ behavior: "smooth" });
}

function rendreTousMetiers() {
  const zone = $("#liste-tous-metiers");
  if (!zone) return;
  zone.innerHTML = `<div class="grille-chips">${METIERS.map((m) => `<button class="chip" data-metier="${m.id}">${m.icone} ${m.nom}</button>`).join("")}</div>`;
  zone.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-metier]");
    if (!chip) return;
    fermerModales();
    filtrerDepuisMetier(chip.dataset.metier);
  });
}

let limiteAffichage = 9;
function carteProHTML(p, index) {
  const teinte = TEINTES[index % TEINTES.length];
  const experience = p.missions ? `${p.missions} interventions` : `Expérience : ${p.exp} ans`;
  const badge = p.badge ? `<span class="pill-badge">${p.badge}</span>` : "";
  const skillsDisplay = p.skills && p.skills.length > 1 ? p.skills.map(s => nomMetier(s)).join(" · ") : nomMetier(p.metier);
  const complementInfo = p.complementSkill ? `<li>✨ + ${p.complementSkill}</li>` : "";

  return `<article class="carte-pro ${p.dispo ? "disponible" : "indispo"}">${badge}<div class="pro-tete"><span class="avatar-pro" style="--teinte:${teinte}">${initiales(p.nom)}<span class="statut"></span></span><div><p class="pro-nom">${p.nom}</p><p class="pro-metier">${skillsDisplay}</p></div></div><ul class="pro-meta"><li>📍 ${p.ville} · ${p.quartier}</li><li><span class="etoiles">${etoiles(p.note)}</span> <strong>${p.note.toFixed(1)}</strong></li><li>🧰 ${experience}</li>${complementInfo}<li class="etat-dispo ${p.dispo ? "oui" : "non"}">${p.dispo ? "● Disponible" : "○ Indisponible"}</li></ul><button class="btn ${p.dispo ? "btn-orange" : "btn-contour"} btn-bloc btn-demander" data-nom="${p.nom}" data-tel="${p.telephone || ""}" data-metier="${p.metier}" data-ville="${p.ville}" data-quartier="${p.quartier}">${p.dispo ? "Demander ce professionnel" : "Être averti"}</button></article>`;
}

function rendrePros() {
  const filtreMetier = $("#filtre-metier");
  const filtreVille = $("#filtre-ville");
  const filtreDispo = $("#filtre-dispo");
  if (!filtreMetier || !filtreVille || !filtreDispo) return;
  
  const metier = filtreMetier.value;
  const ville = filtreVille.value;
  const dispo = filtreDispo.checked;

  const resultats = PROS.filter((p) => (metier === "tous" || p.skills.includes(metier) || p.metier === metier) && (ville === "toutes" || p.ville === ville) && (!dispo || p.dispo));

  const compte = $("#compte-pros");
  if (resultats.length > 0) {
    compte.innerHTML = `<span class="pastille">✅ ${resultats.length} professionnel(s) disponible(s)</span>`;
  } else { compte.textContent = ""; }

  const grille = $("#grille-pros");
  const etatVide = $("#etat-vide");
  const btnVoirPlus = $("#btn-voir-plus");
  
  if (grille) grille.innerHTML = resultats.slice(0, limiteAffichage).map(carteProHTML).join("");
  if (etatVide) etatVide.hidden = resultats.length > 0;
  if (grille) grille.hidden = resultats.length === 0;
  if (btnVoirPlus) btnVoirPlus.style.display = resultats.length > limiteAffichage ? "" : "none";
}

const grillePros = $("#grille-pros");
if (grillePros) {
  grillePros.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-demander");
    if (!btn) return;
    ouvrirModaleConditions('client_prestation');
    window.tempPrestationData = { metier: btn.dataset.metier, ville: btn.dataset.ville, quartier: btn.dataset.quartier, cible: btn.dataset.nom, cibleTel: btn.dataset.tel };
  });
}

["#filtre-metier", "#filtre-ville", "#filtre-dispo"].forEach((sel) => {
  const el = $(sel);
  if (el) el.addEventListener("change", () => { limiteAffichage = 9; rendrePros(); });
});
const btnReset = $("#btn-reset-filtres");
if (btnReset) btnReset.addEventListener("click", () => { $("#filtre-metier").value = "tous"; $("#filtre-ville").value = "toutes"; $("#filtre-dispo").checked = true; limiteAffichage = 9; rendrePros(); });
const btnVoirPlus = $("#btn-voir-plus");
if (btnVoirPlus) btnVoirPlus.addEventListener("click", () => { limiteAffichage += 9; rendrePros(); });

const assistant = { etape: 1, metier: null, ville: null, quartier: "", cible: null, cibleTel: "" };
function rendreChipsAssistant() {
  const chipsMetier = $("#chips-metier");
  const chipsVille = $("#chips-ville");
  if (!chipsMetier || !chipsVille) return;
  chipsMetier.innerHTML = METIERS.map((m) => `<button type="button" class="chip" data-id="${m.id}">${m.icone} ${m.nom}</button>`).join("");
  chipsVille.innerHTML = VILLES.map((v) => `<button type="button" class="chip" data-id="${v}">${v}</button>`).join("");
  
  chipsMetier.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const autreContainer = $("#autre-besoin-container");
    if(autreContainer && autreContainer.style.display !== "none") toggleAutreBesoin();
    
    $$("#chips-metier .chip").forEach((c) => c.classList.remove("act"));
    chip.classList.add("act");
    assistant.metier = chip.dataset.id;
    $("#suiv-1").disabled = false;
  });
  chipsVille.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$("#chips-ville .chip").forEach((c) => c.classList.remove("act"));
    chip.classList.add("act");
    assistant.ville = chip.textContent;
    $("#suiv-2").disabled = false;
  });
}

function allerEtape(n, silencieux = false) {
  assistant.etape = n;
  [1, 2, 3, 4].forEach((i) => { const pas = $("#pas-" + i); if (pas) pas.hidden = i !== n; });
  const barre = $("#prog-barre");
  if (barre) barre.style.width = (n / 4) * 100 + "%";
  $$("#prog-etapes li").forEach((li) => {
    const e = Number(li.dataset.etape);
    li.classList.toggle("actif", e === n);
    li.classList.toggle("fait", e < n);
  });
  if (n >= 3 && assistant.metier && assistant.ville && !silencieux) afficherIndiceMatch();
  if (n === 4) afficherResume();
}

function afficherIndiceMatch() {
  const n = compterDisponibles(assistant.metier, assistant.ville);
  const zone = $("#indice-match");
  if (!zone) return;
  if (n > 0) { zone.className = "indice-match"; zone.innerHTML = `✅ <strong>${n} pro disponible</strong> à ${assistant.ville}.`; } 
  else { zone.className = "indice-match neutre"; zone.innerHTML = `🔎 Aucun profil pour l'instant, nous chercherons pour vous.`; }
}

function afficherResume() {
  const resume = $("#resume-demande");
  let metierAffiche = assistant.metier === "autre" ? $("#champ-autre-besoin").value : nomMetier(assistant.metier);
  if (resume) resume.innerHTML = `<div class="chips-exemples"><span>🧰 ${metierAffiche}</span><span>📍 ${assistant.ville}</span></div>`;
  const pMetier = $("#p-metier-ro"); if (pMetier) pMetier.value = metierAffiche;
  const pVille = $("#p-ville-ro"); if (pVille) pVille.value = assistant.ville;
  const pQuartier = $("#p-quartier-ro"); if (pQuartier) pQuartier.value = assistant.quartier || "—";
}

const suiv1 = $("#suiv-1"); if (suiv1) suiv1.addEventListener("click", () => {
  if(assistant.metier === "autre" && !$("#champ-autre-besoin").value.trim()) { montrerToast("Précisez votre besoin", "orange"); return; }
  allerEtape(2);
});
const suiv2 = $("#suiv-2"); if (suiv2) suiv2.addEventListener("click", () => allerEtape(3));
const retour2 = $("#retour-2"); if (retour2) retour2.addEventListener("click", () => allerEtape(1));
const retour3 = $("#retour-3"); if (retour3) retour3.addEventListener("click", () => allerEtape(2));
const suiv3 = $("#suiv-3");
if (suiv3) {
  suiv3.addEventListener("click", () => {
    const q = $("#champ-quartier").value.trim();
    if (!q) { montrerToast("Merci d'indiquer votre quartier.", "orange"); return; }
    assistant.quartier = q;
    allerEtape(4);
  });
}

function ouvrirPrestation(opts = {}) {
  ouvrirModale("modale-prestation");
  const data = window.tempPrestationData || opts;
  assistant.cible = data.cible || null;
  assistant.cibleTel = data.cibleTel || "";
  
  if (data.metier) {
    assistant.metier = data.metier;
    $$("#chips-metier .chip").forEach((c) => c.classList.toggle("act", c.dataset.id === data.metier));
    const s1 = $("#suiv-1"); if (s1) s1.disabled = false;
  }
  if (data.ville) {
    assistant.ville = data.ville;
    $$("#chips-ville .chip").forEach((c) => c.classList.toggle("act", c.textContent === data.ville));
    const s2 = $("#suiv-2"); if (s2) s2.disabled = false;
  }
  if (data.metier && data.ville) allerEtape(3);
  else allerEtape(data.metier ? 2 : 1);
  window.tempPrestationData = null;
}

$$(".js-ouvrir-prestation").forEach((b) => b.addEventListener("click", () => ouvrirModaleConditions('client_prestation')));
$$(".js-ouvrir-placement").forEach((b) => b.addEventListener("click", () => ouvrirModaleConditions('client_placement')));
$$(".js-ouvrir-pro").forEach((b) => b.addEventListener("click", () => ouvrirModaleConditions('pro')));
const btnTousMetiers = $("#btn-tous-metiers");
if (btnTousMetiers) btnTousMetiers.addEventListener("click", () => ouvrirModale("modale-metiers"));

function simulerEnvoi(btn, duree, suite) {
  if (!btn) return;
  const texte = btn.innerHTML;
  btn.classList.add("chargement"); btn.disabled = true; btn.innerHTML = "Envoi...";
  setTimeout(() => { btn.classList.remove("chargement"); btn.disabled = false; btn.innerHTML = texte; suite(); }, duree);
}

const formPrestation = $("#form-prestation");
if (formPrestation) {
  formPrestation.addEventListener("submit", (e) => {
    e.preventDefault();
    if(!$("#p-nom").value || !$("#p-tel").value || !$("#p-desc").value) { montrerToast("Champs obligatoires manquants", "orange"); return; }
    const donnees = { type: "prestation", nom: $("#p-nom").value, telephone: $("#p-tel").value, whatsapp: $("#p-wa").value, metier: $("#p-metier-ro").value, ville: assistant.ville, quartier: assistant.quartier, description: $("#p-desc").value, proDemande: assistant.cible || "", proTel: assistant.cibleTel || "" };
    simulerEnvoi($("#btn-envoi-prestation"), 1000, async () => {
      await envoyerDonnees(donnees);
      $("#corps-prestation").hidden = true; $("#succes-prestation").hidden = false;
    });
  });
}

const formPlacement = $("#form-placement");
if (formPlacement) {
  formPlacement.addEventListener("submit", (e) => {
    e.preventDefault();
    let typePersonne = $("#pl-type").value;
    if(typePersonne === "Autre") typePersonne = $("#pl-autre-type").value;
    if(!$("#pl-nom").value || !$("#pl-tel").value || !$("#pl-desc").value || !typePersonne) { montrerToast("Champs obligatoires manquants", "orange"); return; }
    const extraSkills = Array.from($$('input[name="extra_skills"]:checked')).map(cb => cb.value).join(",");
    const donnees = { type: "placement", nom: $("#pl-nom").value, telephone: $("#pl-tel").value, whatsapp: $("#pl-wa").value, ville: $("#pl-ville").value, typePersonne: typePersonne, extraSkills: extraSkills, description: $("#pl-desc").value };
    simulerEnvoi($("#btn-envoi-placement"), 1000, async () => {
      await envoyerDonnees(donnees);
      $("#corps-placement").hidden = true; $("#succes-placement").hidden = false;
    });
  });
}

const formPro = $("#form-pro");
if (formPro) {
  formPro.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    if(!$("#pr-nom").value || !$("#pr-tel").value || !$("#pr-wa").value || !$("#pr-desc").value) ok = false;
    const skillsChecked = Array.from($$('input[name="pr_skills"]:checked')).map(cb => cb.value);
    if(skillsChecked.length === 0) ok = false;
    if (skillsChecked.includes("autre") && !$("#pr-custom-skill").value.trim()) ok = false;
    if(!$("#pro-cond").checked) ok = false;
    if(!ok) { montrerToast("Merci de compléter correctement le formulaire.", "orange"); return; }

    const donnees = { type: "professionnel", nom: $("#pr-nom").value, telephone: $("#pr-tel").value, whatsapp: $("#pr-wa").value, skills: skillsChecked.join(","), customSkill: skillsChecked.includes("autre") ? $("#pr-custom-skill").value.trim() : "", ville: $("#pr-ville").value, experience: $("#pr-exp").value, description: $("#pr-desc").value };
    simulerEnvoi($("#btn-envoi-pro"), 1000, async () => {
      await envoyerDonnees(donnees);
      $("#corps-pro").hidden = true; $("#succes-pro").hidden = false;
    });
  });
}

$$(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  const reponse = item.querySelector(".faq-reponse");
  if (!question || !reponse) return;
  question.addEventListener("click", () => {
    const dejaOuvert = item.classList.contains("ouvert");
    $$(".faq-item").forEach((autre) => { autre.classList.remove("ouvert"); autre.querySelector(".faq-reponse").style.maxHeight = null; });
    if (!dejaOuvert) { item.classList.add("ouvert"); reponse.style.maxHeight = reponse.scrollHeight + "px"; }
  });
});

function animerCompteurs() {
  const section = $("#statistiques");
  if (!section) return;
  const observateur = new IntersectionObserver((entrees, obs) => {
    entrees.forEach((entree) => {
      if (!entree.isIntersecting) return;
      obs.disconnect();
      $$(".stat-nombre").forEach((el) => {
        const cible = Number(el.dataset.cible); const suffixe = el.dataset.suffixe || "";
        if (MOUVEMENT_REDUIT) { el.textContent = cible + suffixe; return; }
        const debut = performance.now();
        (function pas(maintenant) {
          const avancement = Math.min((maintenant - debut) / 1500, 1);
          el.textContent = Math.round(cible * (1 - Math.pow(1 - avancement, 3))) + suffixe;
          if (avancement < 1) requestAnimationFrame(pas);
        })(debut);
      });
    });
  }, { threshold: 0.35 });
  observateur.observe(section);
}

function activerReveals() {
  const elements = $$(".reveal");
  if (MOUVEMENT_REDUIT) { elements.forEach((el) => el.classList.add("in")); return; }
  const observateur = new IntersectionObserver((entrees, obs) => {
    entrees.forEach((entree) => { if (entree.isIntersecting) { entree.target.classList.add("in"); obs.unobserve(entree.target); } });
  }, { threshold: 0.12 });
  elements.forEach((el) => observateur.observe(el));
}
function surDefilement() {
  const entete = $("#entete");
  if (entete) entete.classList.toggle("deroule", window.scrollY > 8);
  let courant = "accueil";
  const sections = ["accueil", "professionnels", "devenir-pro", "comment", "faq", "contact"];
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= (el.offsetTop - 150)) { courant = id; }
  });
  $$(".nav-lien").forEach((lien) => {
    lien.classList.remove("actif");
    if (lien.getAttribute("href") === "#" + courant) { lien.classList.add("actif"); }
  });
}
window.addEventListener("scroll", surDefilement, { passive: true });

function configurerWhatsApp() { $$(".wa-lien").forEach((a) => { a.href = lienWA("Bonjour Mille Métiers"); }); }

function remplirBandeau() {
  const bandeau = $("#bandeau-contenu");
  if (!bandeau) return;
  const texte = METIERS.map(m => `<div class="defile-groupe"><div class="defile-carte"><div class="defile-icone">${m.icone}</div>${m.nom}</div></div>`).join("");
  bandeau.innerHTML = texte + texte;
}

function initialiser() {
  const selectVilles = $$("#filtre-ville, #pl-ville, #pr-ville");
  selectVilles.forEach((s) => { VILLES.forEach((v) => { const opt = document.createElement("option"); opt.value = v; opt.textContent = v; s.appendChild(opt); }); });
  remplirBandeau(); rendreGrilleMetiers(); rendreTousMetiers(); rendreChipsAssistant(); rendrePros();
  configurerWhatsApp(); animerCompteurs(); activerReveals(); surDefilement();
  const skillAutre = $("#pr-skill-autre");
  if (skillAutre) skillAutre.addEventListener("change", function() { toggleCustomSkill(this); });
}
/* ==========================================================
   GESTION DU MENU MOBILE (BURGER)
========================================================== */
const btnMenu = $("#btn-menu");
const menuMobile = $("#menu-mobile");

if (btnMenu && menuMobile) {
  btnMenu.addEventListener("click", () => {
    // Ouvre/Ferme le menu
    const estOuvert = menuMobile.classList.toggle("ouvert");
    
    // Anime le bouton burger (optionnel, si vous avez les classes CSS)
    btnMenu.classList.toggle("ouvert", estOuvert);
    
    // Accessibilité
    btnMenu.setAttribute("aria-expanded", estOuvert);
  });

  // Fermer le menu quand on clique sur un lien
  menuMobile.querySelectorAll("a").forEach(lien => {
    lien.addEventListener("click", () => {
      menuMobile.classList.remove("ouvert");
      btnMenu.classList.remove("ouvert");
    });
  });
}
document.addEventListener("DOMContentLoaded", initialiser);
