/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion } from '../types';

// Subject definition arrays
export const VALID_SUBJECTS = [
  "English",
  "Mathematics",
  "Biology",
  "Physics",
  "Chemistry",
  "Further Mathematics",
  "Social Sciences"
];

// Helper to reliably generate 50 highly realistic Nigerian exam questions if the student demands a full-length, real exam experience.
// Incorporates actual curricula and question styles for WAEC, JAMB, Junior WAEC (BECE), and Common Entrance.
export function generateExamQuestions(exam: string, subject: string): QuizQuestion[] {
  const list: QuizQuestion[] = [];
  const normalizedSubject = subject.toLowerCase();

  // We can write generators based on the selected subject!
  if (normalizedSubject.includes("math") && !normalizedSubject.includes("further")) {
    for (let i = 1; i <= 120; i++) {
      let q = "";
      let opts: string[] = [];
      let corr = 0;
      let exp = "";

      const seed1 = i * 4 + 7;
      const seed2 = i * 3 + 2;

      if (i % 6 === 0) {
        // AP / GP sequence question
        const commonDiff = i + 2;
        const firstTerm = seed1;
        const termIndex = 5;
        const ans = firstTerm + (termIndex - 1) * commonDiff;
        q = `[Q${i}] Find the ${termIndex}th term of an Arithmetic Progression (A.P.) whose first term is ${firstTerm} and common difference is ${commonDiff}.`;
        opts = [
          `${ans - commonDiff}`,
          `${ans + 5}`,
          `${ans}`,
          `${ans * 2}`
        ];
        corr = 2;
        exp = `Using the formula for the nth term of an A.P., T_n = a + (n - 1)d. Here, a = ${firstTerm}, d = ${commonDiff}, and n = ${termIndex}. Therefore, T_5 = ${firstTerm} + (4)*${commonDiff} = ${firstTerm} + ${4 * commonDiff} = ${ans}.`;
      } else if (i % 6 === 1) {
        // Quadratic equation formula / factoring
        const root1 = (i % 4) + 1;
        const root2 = (i % 3) + 2;
        const b = -(root1 + root2);
        const c = root1 * root2;
        q = `[Q${i}] Solve the quadratic equation x² ${b < 0 ? '-' : '+'} ${Math.abs(b)}x ${c < 0 ? '-' : '+'} ${Math.abs(c)} = 0. Find the values of x.`;
        opts = [
          `x = ${root1} or x = ${root2}`,
          `x = -${root1} or x = -${root2}`,
          `x = ${root1} or x = -${root2}`,
          `x = 0 or x = ${root1 + root2}`
        ];
        corr = 0;
        exp = `Factoring the quadratic equation gives (x - ${root1})(x - ${root2}) = 0. Solving for x yields the roots x = ${root1} and x = ${root2}.`;
      } else if (i % 6 === 2) {
        // Geometry / Angles in a Triangle or Circle Theorems
        const baseAngle = 40 + (i % 6) * 5;
        const verticalAngle = 180 - (2 * baseAngle);
        q = `[Q${i}] In an isosceles triangle XYZ, |XY| = |XZ|. If angle YXZ is equal to ${verticalAngle} degrees, calculate the base angle XYZ.`;
        opts = [
          `${baseAngle + 10}°`,
          `${baseAngle}°`,
          `${180 - baseAngle}°`,
          `${baseAngle / 2}°`
        ];
        corr = 1;
        exp = `An isosceles triangle has two equal base angles opposite the equal sides. Let the base angle be θ. In triangle XYZ: ${verticalAngle}° + θ + θ = 180°. Hence, 2θ = 180° - ${verticalAngle}° = ${2 * baseAngle}°. This means θ = ${baseAngle}°.`;
      } else if (i % 6 === 3) {
        // Ratio and Fraction proportion
        const totalAmount = 1500 * (i + 1);
        const ratio1 = 2;
        const ratio2 = 3;
        const sum = ratio1 + ratio2;
        const absoluteShare = (ratio2 / sum) * totalAmount;
        q = `[Q${i}] Two students, Amaka and Taiwo, shared ₦${totalAmount} in the ratio ${ratio1}:${ratio2}. What is Taiwo's share of the money?`;
        opts = [
          `₦${(ratio1 / sum) * totalAmount}`,
          `₦${absoluteShare - 200}`,
          `₦${totalAmount}`,
          `₦${absoluteShare}`
        ];
        corr = 3;
        exp = `The total ratio ratio sum is ${ratio1} + ${ratio2} = ${sum}. Taiwo's fraction is ${ratio2}/${sum}. Therefore, Taiwo gets: (${ratio2}/${sum}) * ₦${totalAmount} = ₦${absoluteShare}.`;
      } else if (i % 6 === 4) {
        // Simple Interest
        const p = 5000 + i * 100;
        const r = 5;
        const t = 3;
        const interest = (p * r * t) / 100;
        q = `[Q${i}] Calculate the simple interest earned on ₦${p} invested for ${t} years at ${r}% per annum.`;
        opts = [
          `₦${interest}`,
          `₦${interest + 120}`,
          `₦${p + interest}`,
          `₦${interest * 1.5}`
        ];
        corr = 0;
        exp = `Simple Interest (S.I.) = (Principal * Rate * Time) / 100. S.I. = (${p} * ${r} * ${t}) / 100 = ₦${interest}.`;
      } else {
        // Trigonometry basics
        q = `[Q${i}] Given that sin(θ) = 3/5, where θ is an acute angle, find the exact value of cos(θ) + tan(θ).`;
        opts = [
          `7/12`,
          `4/5`,
          `31/20`,
          `23/15`
        ];
        corr = 2;
        exp = `Since sin(θ) = 3/5 (opposite/hypotenuse), the adjacent side of the right-angled triangle is found via Pythagoras: adjacent = √(5² - 3²) = 4. Thus, cos(θ) = adjacent/hypotenuse = 4/5, and tan(θ) = opposite/adjacent = 3/4. Sum = 4/5 + 3/4 = (16 + 15)/20 = 31/20.`;
      }

      list.push({
        id: `${exam.toLowerCase()}-${subject.toLowerCase()}-${i}`,
        question: q,
        options: opts,
        correctIndex: corr,
        explanation: exp
      });
    }
  } else if (normalizedSubject.includes("further")) {
    for (let i = 1; i <= 120; i++) {
      let q = "";
      let opts: string[] = [];
      let corr = 0;
      let exp = "";

      if (i % 5 === 1) {
        // Derivatives
        const power = (i % 3) + 2;
        const coef = (i % 4) + 1;
        q = `[Q${i}] Differentiate the function f(x) = ${coef}x^${power} with respect to x.`;
        opts = [
          `${coef * power}x^${power - 1}`,
          `${coef}x^${power - 1}`,
          `${coef * power}x^${power}`,
          `${coef / power}x^${power + 1}`
        ];
        corr = 0;
        exp = `Apply the power rule of differentiation: d/dx[ax^n] = a * n * x^(n-1). For ${coef}x^${power}, the derivative is ${coef} * ${power} * x^(${power}-1) = ${coef * power}x^${power - i % 1 === 0 ? power - 1 : 0}.`;
      } else if (i % 5 === 2) {
        // Integration limits
        q = `[Q${i}] Evaluate the definite integral of 2x dx from x=1 to x=3.`;
        opts = [
          `4`,
          `6`,
          `8`,
          `10`
        ];
        corr = 2;
        exp = `The integral of 2x with respect to x is x² + C. Evaluating from 1 to 3: [3²] - [1²] = 9 - 1 = 8.`;
      } else if (i % 5 === 3) {
        // Dot product of vectors
        const v1_i = (i % 3) + 1;
        const v2_i = (i % 2) + 2;
        const v1_j = 4;
        const v2_j = -2;
        const ans = v1_i * v2_i + v1_j * v2_j;
        q = `[Q${i}] Find the scalar (dot) product of two vectors A = ${v1_i}i + ${v1_j}j and B = ${v2_i}i - ${Math.abs(v2_j)}j.`;
        opts = [
          `${ans + 5}`,
          `${ans}`,
          `${ans - 3}`,
          `0`
        ];
        corr = 1;
        exp = `The dot product of A and B is given by (A_i * B_i) + (A_j * B_j). Here, (${v1_i} * ${v2_i}) + (${v1_j} * ${v2_j}) = ${v1_i * v2_i} + (${v1_j * v2_j}) = ${ans}.`;
      } else if (i % 5 === 4) {
        // Projectile motion maths mechanics
        const angleValue = 30; // degrees
        q = `[Q${i}] A projectile is launched from ground level with an initial velocity of u m/s at an angle of 30° to the horizontal. What is the mathematical formula for the maximum height (H) attained?`;
        opts = [
          `H = u² / 2g`,
          `H = u² sin²(30°) / 2g`,
          `H = u sin(30°) / g`,
          `H = u² sin(60°) / g`
        ];
        corr = 1;
        exp = `The maximum height H of a projectile is derived as H = u² sin²(θ) / 2g. Evaluating at θ = 30° gives H = u² sin²(30°) / 2g.`;
      } else {
        // Matrices
        const detval = 2 * i;
        q = `[Q${i}] Find the determinant of the 2x2 matrix M = [[${detval}, 4], [2, 3]].`;
        opts = [
          `${detval * 3 - 8}`,
          `${detval * 3}`,
          `${detval + 8}`,
          `${detval * 2}`
        ];
        corr = 0;
        exp = `The determinant of a 2x2 matrix [[a, b], [c, d]] is calculated as (ad - bc). Here, determinant = (${detval} * 3) - (4 * 2) = ${detval * 3} - 8 = ${detval * 3 - 8}.`;
      }

      list.push({
        id: `${exam.toLowerCase()}-${subject.toLowerCase()}-${i}`,
        question: q,
        options: opts,
        correctIndex: corr,
        explanation: exp
      });
    }
  } else if (normalizedSubject.includes("physics")) {
    for (let i = 1; i <= 120; i++) {
      let q = "";
      let opts: string[] = [];
      let corr = 0;
      let exp = "";

      if (i % 5 === 1) {
        // Linear Motion / Forces
        const force = 10 * (i % 4 + 1);
        const mass = 5;
        const acc = force / mass;
        q = `[Q${i}] A constant horizontal force of ${force} N acts on a body of mass ${mass} kg resting on a smooth surface. Calculate the acceleration of the body.`;
        opts = [
          `${acc - 1} m/s²`,
          `0 m/s²`,
          `${acc} m/s²`,
          `${force * mass} m/s²`
        ];
        corr = 2;
        exp = `Newton's second law states that Force = Mass * Acceleration (F = ma). Hence, Acceleration (a) = F / m = ${force} N / ${mass} kg = ${acc} m/s².`;
      } else if (i % 5 === 2) {
        // Wave speed / frequency
        const freq = 200 + i * 5;
        const wavelength = 1.5;
        const vel = freq * wavelength;
        q = `[Q${i}] A sound wave propagating in air has a frequency of ${freq} Hz. If the wavelength of the sound is ${wavelength} m, calculate the speed of the wave in air.`;
        opts = [
          `${vel} m/s`,
          `${freq / wavelength} m/s`,
          `330 m/s`,
          `${freq + wavelength} m/s`
        ];
        corr = 0;
        exp = `Wave Speed (v) = Frequency (f) * Wavelength (λ). Therefore, v = ${freq} Hz * ${wavelength} m = ${vel} m/s.`;
      } else if (i % 5 === 3) {
        // Specific Heat Capacity
        const tempChange = 20;
        const massValue = 2;
        const c_water = 4200;
        const heat = massValue * c_water * tempChange;
        q = `[Q${i}] Calculate the quantity of heat required to raise the temperature of ${massValue} kg of water from 30°C to 50°C. (Specific heat capacity of water = 4200 J/kg°C).`;
        opts = [
          `${heat / 1000} kJ`,
          `${heat} kJ`,
          `84,000 J`,
          `${heat * 2} J`
        ];
        corr = 0;
        exp = `The formula for heat quantity is Q = mcΔθ. Here, m = ${massValue} kg, c = 4200 J/kg°C, and Δθ = 50°C - 30°C = ${tempChange}°C. Hence, Q = ${massValue} * 4200 * ${tempChange} = ${heat} J = ${heat / 1000} kJ.`;
      } else if (i % 5 === 4) {
        // Refractive index
        q = `[Q${i}] The speed of light in a vacuum is 3.0 × 10⁸ m/s. If the refractive index of a glass medium is 1.5, what is the speed of light in this glass?`;
        opts = [
          `4.5 × 10⁸ m/s`,
          `2.0 × 10⁸ m/s`,
          `1.5 × 10⁸ m/s`,
          `3.0 × 10⁸ m/s`
        ];
        corr = 1;
        exp = `Refractive index (n) = Speed of light in vacuum (c) / Speed of light in medium (v). Therefore, v = c / n = (3.0 × 10⁸) / 1.5 = 2.0 × 10⁸ m/s.`;
      } else {
        // Radioactive decay half-life
        const halfLifes = 3;
        const initial = 80;
        const final = initial / Math.pow(2, halfLifes);
        q = `[Q${i}] A radioactive sample of mass ${initial} g has a half-life of 2 days. What quantity of the active isotopes remains after 6 days?`;
        opts = [
          `${final + 10} g`,
          `${initial / 2} g`,
          `0 g`,
          `${final} g`
        ];
        corr = 3;
        exp = `After 6 days (which constitutes 6 / 2 = 3 half-lives), the remaining radioactive isotope fraction of the element is (1/2)³ = 1/8. Thus, final active mass = ${initial} g * (1/8) = ${final} g.`;
      }

      list.push({
        id: `${exam.toLowerCase()}-${subject.toLowerCase()}-${i}`,
        question: q,
        options: opts,
        correctIndex: corr,
        explanation: exp
      });
    }
  } else if (normalizedSubject.includes("chemistry")) {
    for (let i = 1; i <= 120; i++) {
      let q = "";
      let opts: string[] = [];
      let corr = 0;
      let exp = "";

      if (i % 5 === 1) {
        // Boyle's or Charles' Law
        const v1 = 100 * (i % 3 + 1);
        const p1 = 1;
        const p2 = 2;
        const v2 = (p1 * v1) / p2;
        q = `[Q${i}] A standard gas occupies a volume of ${v1} cm³ at a pressure of ${p1} atm. What volume will it occupy at a pressure of ${p2} atm if the temperature remains constant?`;
        opts = [
          `${v1 * 2} cm³`,
          `${v2} cm³`,
          `${v1 / 4} cm³`,
          `${v1} cm³`
        ];
        corr = 1;
        exp = `According to Boyle's law, P1V1 = P2V2. Thus, V2 = (P1V1)/P2 = (${p1} * ${v1}) / ${p2} = ${v2} cm³.`;
      } else if (i % 5 === 2) {
        // Electrolysis Faraday
        q = `[Q${i}] How many Faraday of electricity are required to deposit one mole of Copper (Cu²⁺) during the electrolysis of Copper (II) sulphate solution?`;
        opts = [
          `1 Faraday`,
          `2 Faraday`,
          `3 Faraday`,
          `96,500 Faraday`
        ];
        corr = 1;
        exp = `The half-reaction for Copper deposition is Cu²⁺ + 2e⁻ -> Cu(s). Since deposit of 1 mole of Cu requires 2 moles of electrons, the quantity of electricity required is exactly 2 Faraday.`;
      } else if (i % 5 === 3) {
        // Periodic Table
        q = `[Q${i}] Which chemical group do elements like Sodium (Na), Potassium (K), and Lithium (Li) belong to in the standard Periodic Table of elements?`;
        opts = [
          `Alkaline Earth Metals (Group 2)`,
          `Halogens (Group 7)`,
          `Alkali Metals (Group 1)`,
          `Noble Gases (Group 8/0)`
        ];
        corr = 2;
        exp = `Sodium, Potassium, and Lithium are highly reactive univalent metals belonging to Group 1, which are known as the Alkali Metals.`;
      } else if (i % 5 === 4) {
        // pH of acidic solution
        q = `[Q${i}] If the Hydrogen ion concentration [H⁺] of an aqueous citric solution is 1.0 × 10⁻³ mol/dm³, determine the comparative pH of the solution.`;
        opts = [
          `pH = 3`,
          `pH = 10`,
          `pH = 7`,
          `pH = 1`
        ];
        corr = 0;
        exp = `pH is mathematically defined as pH = -log10[H⁺]. For [H⁺] = 1.0 × 10⁻³ mol/dm³, pH = -log10(10⁻³) = 3.`;
      } else {
        // IUPAC nomenclature organic
        q = `[Q${i}] What is the IUPAC systematic name of the straight-chain hydrocarbon compound with the molecular formula CH₃-CH₂-CH₂-OH?`;
        opts = [
          `Propan-1-ol`,
          `Propanal`,
          `Ethanol`,
          `Butan-1-ol`
        ];
        corr = 0;
        exp = `The carbon chain contains 3 carbon atoms (Propane root) with a primary hydroxyl (-OH) group at the first carbon terminal. Thus, its IUPAC name is Propan-1-ol.`;
      }

      list.push({
        id: `${exam.toLowerCase()}-${subject.toLowerCase()}-${i}`,
        question: q,
        options: opts,
        correctIndex: corr,
        explanation: exp
      });
    }
  } else if (normalizedSubject.includes("biology")) {
    for (let i = 1; i <= 120; i++) {
      let q = "";
      let opts: string[] = [];
      let corr = 0;
      let exp = "";

      if (i % 5 === 1) {
        q = `[Q${i}] Which of the following organelles is known as the powerhouse of the cell because cellular respiration occurs inside it?`;
        opts = [
          `Ribosome`,
          `Mitochondrion`,
          `Nucleus`,
          `Golgi apparatus`
        ];
        corr = 1;
        exp = `The mitochondrion is responsible for synthesizing ATP through aerobic respiration and is colloquially called the powerhouse of the cell.`;
      } else if (i % 5 === 2) {
        q = `[Q${i}] The transport tissue responsible for carrying manufactured food substances from leaves to other sections of plants is called what?`;
        opts = [
          `Xylem tissues`,
          `Phloem tissues`,
          `Epidermis`,
          `Cortex cell`
        ];
        corr = 1;
        exp = `Phloem tissues serve as the conduits for translocation (transporting synthesized sugars and food from the leaves). Xylem, on the other hand, transports water and mineral salts.`;
      } else if (i % 5 === 3) {
        q = `[Q${i}] In genetics, a cross between a homozygous dominant tall pea plant (TT) and a homozygous recessive short pea plant (tt) will yield what kind of F1 generation offspring?`;
        opts = [
          `100% tall plants (Tt)`,
          `50% tall, 50% short plants`,
          `100% short plants (tt)`,
          `75% tall, 25% short plants`
        ];
        corr = 0;
        exp = `A cross between TT and tt produces offspring that are all heterozygous (Tt). Since the 'T' allele for tallness is completely dominant, 100% of the F1 generation plants will display a tall phenotype.`;
      } else if (i % 5 === 4) {
        q = `[Q${i}] Which of these represents a critical vestigial or evolutionary residual organ in the human body?`;
        opts = [
          `Kidney`,
          `Thyroid gland`,
          `Vermiform appendix`,
          `Gallbladder`
        ];
        corr = 2;
        exp = `The vermiform appendix is a narrow pouch-like structure that has lost its ancestral digestive role in humans and is considered a vestigial organ.`;
      } else {
        q = `[Q${i}] In an ecosystem, which level represents the primary consumers that feed directly on green primary producers?`;
        opts = [
          `Saprotrophic bacteria`,
          `Carnivorous predators`,
          `Herbivorous animals`,
          `Secondary omnivorous`
        ];
        corr = 2;
        exp = `Herbivores (e.g. grasshoppers, goats) eat green plants (producers) directly, making them the primary consumers in food web diagrams.`;
      }

      list.push({
        id: `${exam.toLowerCase()}-${subject.toLowerCase()}-${i}`,
        question: q,
        options: opts,
        correctIndex: corr,
        explanation: exp
      });
    }
  } else if (normalizedSubject.includes("english")) {
    for (let i = 1; i <= 120; i++) {
      let q = "";
      let opts: string[] = [];
      let corr = 0;
      let exp = "";

      if (i % 5 === 1) {
        q = `[Q${i}] Choose the option nearest in meaning to the capitalized word: The principal gave a COGENT reason for suspending the rowdy student.`;
        opts = [
          `compelling and convincing`,
          `vague and confusing`,
          `hasty and standard`,
          `academic yet theoretical`
        ];
        corr = 0;
        exp = `'Cogent' means clear, logical, and convincing. Therefore, 'compelling and convincing' is the closest alternative.`;
      } else if (i % 5 === 2) {
        q = `[Q${i}] Complete this sentence with the most grammatically correct verbal form: The warden, along with several of his search dogs, ________ arrived at the compound boundary.`;
        opts = [
          `have`,
          `were`,
          `has`,
          `are`
        ];
        corr = 2;
        exp = `When a singular subject ('The warden') is followed by parenthetical phrases like 'along with' or 'as well as', the singular verb concordance ('has') must be used.`;
      } else if (i % 5 === 3) {
        q = `[Q${i}] Choose the word that is opposite in meaning to the capitalized adjective: Mary was extremely LAX when managing the organization's confidential archives.`;
        opts = [
          `careless`,
          `meticulous and strict`,
          `hostile`,
          `lazy`
        ];
        corr = 1;
        exp = `'Lax' means slack, careless, or loose. The direct antonym is being strict, careful, or 'meticulous'.`;
      } else if (i % 5 === 4) {
        q = `[Q${i}] Identify the correct preposition to complete the idiomatic expression: The rogue politicians are working in collusion ________ the oil racketeers.`;
        opts = [
          `with`,
          `to`,
          `against`,
          `for`
        ];
        corr = 0;
        exp = `The correct prepositional idiom is 'collinear/collusion in partnership with' someone. Therefore, 'collusion with' is the appropriate syntax.`;
      } else {
        q = `[Q${i}] Choose the phonetic sound matching the underlined letters in the word: cl<u>ea</u>n.`;
        opts = [
          `/i:/ (long ee)`,
          `/e/ (short e)`,
          `/ai/ (long i)`,
          `/u:/ (long oo)`
        ];
        corr = 0;
        exp = `The spelling 'ea' in the word 'clean' produces a long closed vowel sound transcribed phonetically as /i:/, the same as in 'seen' or 'meet'.`;
      }

      list.push({
        id: `${exam.toLowerCase()}-${subject.toLowerCase()}-${i}`,
        question: q,
        options: opts,
        correctIndex: corr,
        explanation: exp
      });
    }
  } else {
    // Social Sciences / National values / general
    for (let i = 1; i <= 120; i++) {
      let q = "";
      let opts: string[] = [];
      let corr = 0;
      let exp = "";

      if (i % 5 === 1) {
        q = `[Q${i}] In which historical year did Nigeria officially adopt its republican constitution, terminating ties with the British monarchy?`;
        opts = [
          `1960`,
          `1963`,
          `1979`,
          `1999`
        ];
        corr = 1;
        exp = `Although Nigeria gained independence in 1960, it officially became a Federal Republic under its own independent Supreme Constitution on October 1st, 1963.`;
      } else if (i % 5 === 2) {
        q = `[Q${i}] Which Nigerian region is internationally known as the center of extensive coal mining, dating back to 1916?`;
        opts = [
          `Enugu State`,
          `Delta State`,
          `Kano State`,
          `Plateau State`
        ];
        corr = 0;
        exp = `Enugu is famously nicknamed the 'Coal City' because coal reserves were discovered there in 1909 and active commercial mining commenced in Enugu in 1916.`;
      } else if (i % 5 === 3) {
        q = `[Q${i}] The primary organ of government tasking/authorizing the creation, review, and enactment of statutory laws is called what?`;
        opts = [
          `The Executive Council`,
          `The Judiciary`,
          `The Legislature`,
          `The National Police Force`
        ];
        corr = 2;
        exp = `The Legislature (e.g., the National Assembly in Nigeria) has the unique constitutional mandate of debating, crafting, and enacting laws.`;
      } else if (i % 5 === 4) {
        q = `[Q${i}] What are the primary colors displayed on the sovereign Flag of Nigeria, as designed by Taiwo Akinkunmi in 1959?`;
        opts = [
          `Green and White`,
          `Red, Green, and Black`,
          `Green, Gold, and White`,
          `Royal Blue and White`
        ];
        corr = 0;
        exp = `The flag consists of a vertical bi-color structure: Green, White, and Green. Green represents the rich agricultural wealth of Nigeria, and White represents peace and unity.`;
      } else {
        q = `[Q${i}] Social integration in Nigeria can be actively boosted by all of the following strategies, EXCEPT:`;
        opts = [
          `Inter-tribal marriages`,
          `Promoting the National Youth Service Corps (NYSC)`,
          `Encouraging ethnocentrism and religious bias`,
          `Engaging in civic education across schools`
        ];
        corr = 2;
        exp = `Ethnocentrism (believing one's ethnic group is superior) and religious bias breed division and violence, severely undermining national unity.`;
      }

      list.push({
        id: `${exam.toLowerCase()}-${subject.toLowerCase()}-${i}`,
        question: q,
        options: opts,
        correctIndex: corr,
        explanation: exp
      });
    }
  }

  return list;
}
