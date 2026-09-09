export type Exercise = {id: string; name: string; group: string; detail?: string};

// Keep existing IDs and labels: past workouts may not specify equipment.
export const exercises: Exercise[] = [
  {
    "id": "bench",
    "name": "Press de banca",
    "group": "Pecho"
  },
  {
    "id": "incline",
    "name": "Press inclinado",
    "group": "Pecho"
  },
  {
    "id": "fly",
    "name": "Aperturas con mancuernas",
    "group": "Pecho"
  },
  {
    "id": "pushup",
    "name": "Flexiones",
    "group": "Pecho"
  },
  {
    "id": "bench_bar",
    "name": "Press plano con barra",
    "group": "Pecho",
    "detail": "Pecho medio · Banco plano · Barra"
  },
  {
    "id": "bench_db",
    "name": "Press plano con mancuernas",
    "group": "Pecho",
    "detail": "Pecho medio · Banco plano · Mancuernas"
  },
  {
    "id": "bench_machine",
    "name": "Press de pecho en máquina",
    "group": "Pecho",
    "detail": "Pecho medio · Máquina"
  },
  {
    "id": "incline_bar",
    "name": "Press inclinado con barra",
    "group": "Pecho",
    "detail": "Pecho alto · Banco inclinado · Barra"
  },
  {
    "id": "incline_db",
    "name": "Press inclinado con mancuernas",
    "group": "Pecho",
    "detail": "Pecho alto · Banco inclinado · Mancuernas"
  },
  {
    "id": "incline_smith",
    "name": "Press inclinado en Smith",
    "group": "Pecho",
    "detail": "Pecho alto · Máquina Smith"
  },
  {
    "id": "decline_bar",
    "name": "Press declinado con barra",
    "group": "Pecho",
    "detail": "Pecho bajo · Banco declinado · Barra"
  },
  {
    "id": "decline_db",
    "name": "Press declinado con mancuernas",
    "group": "Pecho",
    "detail": "Pecho bajo · Banco declinado · Mancuernas"
  },
  {
    "id": "incline_fly",
    "name": "Aperturas inclinadas con mancuernas",
    "group": "Pecho",
    "detail": "Pecho alto · Mancuernas"
  },
  {
    "id": "pec_deck",
    "name": "Aperturas en máquina (pec deck)",
    "group": "Pecho",
    "detail": "Pecho medio · Máquina"
  },
  {
    "id": "cable_fly_low",
    "name": "Cruces en polea de abajo hacia arriba",
    "group": "Pecho",
    "detail": "Pecho alto · Poleas bajas"
  },
  {
    "id": "cable_fly_mid",
    "name": "Cruces en polea a media altura",
    "group": "Pecho",
    "detail": "Pecho medio · Poleas"
  },
  {
    "id": "cable_fly_high",
    "name": "Cruces en polea de arriba hacia abajo",
    "group": "Pecho",
    "detail": "Pecho bajo · Poleas altas"
  },
  {
    "id": "dips",
    "name": "Fondos en paralelas",
    "group": "Pecho",
    "detail": "Pecho bajo · Tríceps · Peso corporal"
  },
  {
    "id": "shoulder",
    "name": "Press de hombros",
    "group": "Hombros"
  },
  {
    "id": "lateral",
    "name": "Elevaciones laterales",
    "group": "Hombros"
  },
  {
    "id": "front_db",
    "name": "Elevaciones frontales con mancuernas",
    "group": "Hombros",
    "detail": "Anterior · Mancuernas"
  },
  {
    "id": "front_bar",
    "name": "Elevaciones frontales con barra",
    "group": "Hombros",
    "detail": "Anterior · Barra"
  },
  {
    "id": "front_plate",
    "name": "Elevaciones frontales con disco",
    "group": "Hombros",
    "detail": "Anterior · Disco"
  },
  {
    "id": "front_cable",
    "name": "Elevaciones frontales en polea",
    "group": "Hombros",
    "detail": "Anterior · Polea"
  },
  {
    "id": "shoulder_bar",
    "name": "Press militar con barra",
    "group": "Hombros",
    "detail": "Barra"
  },
  {
    "id": "shoulder_db",
    "name": "Press de hombros con mancuernas",
    "group": "Hombros",
    "detail": "Mancuernas"
  },
  {
    "id": "arnold",
    "name": "Press Arnold",
    "group": "Hombros",
    "detail": "Mancuernas"
  },
  {
    "id": "shoulder_machine",
    "name": "Press de hombros en máquina",
    "group": "Hombros",
    "detail": "Máquina"
  },
  {
    "id": "lateral_cable",
    "name": "Elevaciones laterales en polea",
    "group": "Hombros",
    "detail": "Lateral · Polea"
  },
  {
    "id": "rear_db",
    "name": "Pájaros con mancuernas",
    "group": "Hombros",
    "detail": "Posterior · Aperturas inversas · Mancuernas"
  },
  {
    "id": "face_pull",
    "name": "Face pull en polea",
    "group": "Hombros",
    "detail": "Posterior · Polea · Cuerda"
  },
  {
    "id": "deadlift",
    "name": "Peso muerto",
    "group": "Espalda"
  },
  {
    "id": "row",
    "name": "Remo con barra",
    "group": "Espalda"
  },
  {
    "id": "pulldown",
    "name": "Jalón al pecho",
    "group": "Espalda"
  },
  {
    "id": "pullup",
    "name": "Dominadas",
    "group": "Espalda"
  },
  {
    "id": "row_db",
    "name": "Remo a una mano con mancuerna",
    "group": "Espalda",
    "detail": "Mancuerna · Unilateral"
  },
  {
    "id": "row_cable",
    "name": "Remo sentado en polea",
    "group": "Espalda",
    "detail": "Polea · Remo bajo"
  },
  {
    "id": "row_machine",
    "name": "Remo en máquina",
    "group": "Espalda",
    "detail": "Máquina"
  },
  {
    "id": "pulldown_neutral",
    "name": "Jalón al pecho con agarre neutro",
    "group": "Espalda",
    "detail": "Polea · Agarre cerrado"
  },
  {
    "id": "pullover_cable",
    "name": "Pullover en polea",
    "group": "Espalda",
    "detail": "Polea · Brazos rectos"
  },
  {
    "id": "squat",
    "name": "Sentadilla",
    "group": "Piernas"
  },
  {
    "id": "legpress",
    "name": "Prensa de piernas",
    "group": "Piernas"
  },
  {
    "id": "lunge",
    "name": "Zancadas",
    "group": "Piernas"
  },
  {
    "id": "legcurl",
    "name": "Curl femoral",
    "group": "Piernas"
  },
  {
    "id": "calf",
    "name": "Elevación de talones",
    "group": "Piernas"
  },
  {
    "id": "goblet",
    "name": "Sentadilla goblet",
    "group": "Piernas",
    "detail": "Mancuerna · Kettlebell"
  },
  {
    "id": "bulgarian",
    "name": "Sentadilla búlgara",
    "group": "Piernas",
    "detail": "Mancuernas · Unilateral"
  },
  {
    "id": "leg_extension",
    "name": "Extensión de cuádriceps",
    "group": "Piernas",
    "detail": "Máquina · Cuádriceps"
  },
  {
    "id": "romanian",
    "name": "Peso muerto rumano",
    "group": "Piernas",
    "detail": "Barra · Femorales · Glúteos"
  },
  {
    "id": "hip_thrust",
    "name": "Hip thrust con barra",
    "group": "Piernas",
    "detail": "Barra · Glúteos"
  },
  {
    "id": "curl",
    "name": "Curl de bíceps",
    "group": "Brazos"
  },
  {
    "id": "triceps",
    "name": "Extensión de tríceps",
    "group": "Brazos"
  },
  {
    "id": "curl_bar",
    "name": "Curl de bíceps con barra",
    "group": "Brazos",
    "detail": "Bíceps · Barra recta o Z"
  },
  {
    "id": "curl_db",
    "name": "Curl de bíceps con mancuernas",
    "group": "Brazos",
    "detail": "Bíceps · Mancuernas"
  },
  {
    "id": "hammer",
    "name": "Curl martillo",
    "group": "Brazos",
    "detail": "Bíceps · Mancuernas · Agarre neutro"
  },
  {
    "id": "preacher",
    "name": "Curl predicador",
    "group": "Brazos",
    "detail": "Bíceps · Banco Scott"
  },
  {
    "id": "triceps_rope",
    "name": "Extensión de tríceps con cuerda",
    "group": "Brazos",
    "detail": "Tríceps · Polea"
  },
  {
    "id": "triceps_overhead",
    "name": "Extensión de tríceps sobre la cabeza",
    "group": "Brazos",
    "detail": "Tríceps · Mancuerna"
  },
  {
    "id": "skullcrusher",
    "name": "Press francés con barra Z",
    "group": "Brazos",
    "detail": "Tríceps · Barra Z"
  },
  {
    "id": "crunch",
    "name": "Abdominales",
    "group": "Core"
  },
  {
    "id": "cable_crunch",
    "name": "Crunch en polea",
    "group": "Core",
    "detail": "Abdominales · Polea"
  }
];
