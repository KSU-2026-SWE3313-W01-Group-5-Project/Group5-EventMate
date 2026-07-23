export default function normalizeAge(ageRestrictions) {
    if (!ageRestrictions?.legalAgeEnforced) {
        return 0;
    }

    const ageMatch = ageRestrictions.ageRuleDescription?.match(/\d{2}/);

    return ageMatch ? Number(ageMatch[0]) : 0;
}

/*
export default function normalizeAge(ageRestrictions) {
    if (!ageRestrictions?.legalAgeEnforced) {
        return 0;
    }

    const ageMatch =
        ageRestrictions.ageRuleDescription?.match(/\d{1,2}/);

    return ageMatch ? Number(ageMatch[0]) : 0;
}

    This stores:

    All Ages → 0
    16 and Over → 16
    18 and Over → 18
    21 and Over → 21
}
 */