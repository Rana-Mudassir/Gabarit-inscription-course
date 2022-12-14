/**
 * Retourne une valeur indiquant si le ID en paramètre est valide.
 * @param {*} id Un ID à valider.
 * @returns Une valeur indiquant si le ID en paramètre est valide.
 */
export const isIDValide = (id) => {
    return typeof id === 'number' && id >= 0;
}

/**
 * Retourne une valeur indiquant si le texte en paramètre est valide.
 * @param {*} texte Un texte à valider.
 * @returns Une valeur indiquant si le texte en paramètre est valide.
 */
export const isTexteValide = (texte) => {
    return typeof texte === 'string' && !!texte;
}

/**
 * Retourne une valeur indiquant si la date en paramètre est valide.
 * @param {*} date Une date à valider.
 * @returns Une valeur indiquant si la date en paramètre est valide.
 */
export const isDateValide = (date) => {
    return typeof date === 'number' && new Date(date).getTime() > 0;
}

/**
 * Retourne une valeur indiquant si la quantité en paramètre est valide.
 * @param {*} quantite Une quantité à valider.
 * @returns Une valeur indiquant si la quantité en paramètre est valide.
 */
export const isQuantiteValide = (quantite) => {
    return typeof quantite === 'number' && quantite > 0;
}