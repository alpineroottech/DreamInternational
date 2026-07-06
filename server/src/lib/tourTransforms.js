/** Sync nested tour children on admin create/update. */

function mapItineraryDays(days) {
  return days.map((d, i) => ({
    dayNumber: Number(d.dayNumber) || i + 1,
    title: d.title || `Day ${i + 1}`,
    description: d.description || null,
    startLocation: d.startLocation || null,
    endLocation: d.endLocation || null,
    altitudeM: d.altitudeM != null && d.altitudeM !== "" ? Number(d.altitudeM) : null,
    notes: d.notes || null,
    order: d.order != null ? Number(d.order) : i,
  }));
}

function mapFaqs(faqs) {
  return faqs.map((f, i) => ({
    question: f.question || "",
    answer: f.answer || "",
    order: f.order != null ? Number(f.order) : i,
  }));
}

export async function transformTourCreate(prisma, data) {
  const { itineraryDays, faqs, ...rest } = data;
  const out = { ...rest };
  if (Array.isArray(itineraryDays) && itineraryDays.length) {
    out.itineraryDays = { create: mapItineraryDays(itineraryDays) };
  }
  if (Array.isArray(faqs) && faqs.length) {
    out.faqs = { create: mapFaqs(faqs) };
  }
  return out;
}

export async function transformTourUpdate(prisma, data, existing) {
  const { itineraryDays, faqs, ...rest } = data;
  const out = { ...rest };

  if (Array.isArray(itineraryDays)) {
    await prisma.itineraryDay.deleteMany({ where: { tourId: existing.id } });
    if (itineraryDays.length) {
      out.itineraryDays = { create: mapItineraryDays(itineraryDays) };
    }
  }

  if (Array.isArray(faqs)) {
    await prisma.tourFAQ.deleteMany({ where: { tourId: existing.id } });
    if (faqs.length) {
      out.faqs = { create: mapFaqs(faqs) };
    }
  }

  return out;
}
