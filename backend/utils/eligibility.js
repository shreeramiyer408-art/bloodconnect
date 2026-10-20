// Feature 6: 90-day donation gap check
export function checkDonationEligibility(lastDonationDate) {
  if (!lastDonationDate) {
    return { eligible: true, message: "Eligible to donate (no previous donation on record)" };
  }

  const today = new Date();
  const lastDate = new Date(lastDonationDate);
  const daysSince = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

  if (daysSince >= 90) {
    return { eligible: true, message: "Eligible to donate" };
  } else {
    return { eligible: false, message: `Not eligible yet — ${90 - daysSince} days remaining` };
  }
}

// Feature 9: Basic health screening check
export function checkHealthEligibility(answers) {
  const riskFlags = [
    answers.feelingWell === false,
    answers.onMedication === true,
    answers.recentSurgery === true,
    answers.chronicIllness === true,
    answers.consumedAlcohol === true,
    answers.weightAbove50 === false
  ];

  const isAtRisk = riskFlags.some((flag) => flag === true);

  return isAtRisk
    ? { eligible: false, message: "Based on your answers, please consult a doctor before donating." }
    : { eligible: true, message: "You appear eligible to donate. Thank you!" };
}
