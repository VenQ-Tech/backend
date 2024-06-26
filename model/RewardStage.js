const rewardTypes = {
  CASH_BONUS: "cashBonus",
  INVESTMENT_CREDIT: "investmentCredit",
  DISCOUNT: "discount",
};

const rewardCriteria = [
  {
    event: "signup",
    reward: {
      type: rewardTypes.CASH_BONUS,
      amount: 100,
    },
  },
  {
    event: "firstInvestment",
    reward: {
      type: rewardTypes.INVESTMENT_CREDIT,
      amount: 50,
    },
  },
  {
    event: "milestoneInvestment",
    reward: {
      type: rewardTypes.DISCOUNT,
      amount: 200,
    },
  },
];

module.exports = { rewardTypes, rewardCriteria };
