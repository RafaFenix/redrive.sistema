import type { Testimonial } from "@/lib/home-helpers";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="rounded-lg border-l-4 border-l-primary bg-card p-6">
      <div className="mb-4 flex gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            ★
          </span>
        ))}
      </div>
      <p className="mb-4 italic text-muted-foreground">"{testimonial.quote}"</p>
      <div>
        <p className="font-semibold text-foreground">{testimonial.author}</p>
        {testimonial.company && (
          <p className="text-sm text-muted-foreground">{testimonial.company}</p>
        )}
      </div>
    </div>
  );
}
