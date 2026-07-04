import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { COMPARISON } from '../landingData';
import { SectionHeading } from './SectionHeading';
import { sectionY } from './landingUi';
import { fadeUp, viewport } from '../motion';

export function ComparisonTable() {
  return (
    <section className={`section-alt ${sectionY}`}>
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Why we're different"
          title="See how we compare"
          description="Don't settle for less. Here's why 500+ residents chose us over other PGs in Nashik."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="lnd-card mt-14 overflow-hidden rounded-[24px] shadow-float"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-body">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-5 font-semibold text-slate-500">Feature</th>
                  <th className="bg-teal-50 px-6 py-5 text-center font-bold text-teal-800">PG Rooms for Boys</th>
                  <th className="px-6 py-5 text-center font-semibold text-slate-400">Other PGs</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.features.map((feature, i) => (
                  <motion.tr
                    key={feature}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewport}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-100"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{feature}</td>
                    <td className="bg-teal-50/50 px-6 py-4 text-center">
                      {COMPARISON.us[i] ? (
                        <Check className="mx-auto h-5 w-5 text-emerald-600" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-red-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {COMPARISON.others[i] ? (
                        <Check className="mx-auto h-5 w-5 text-slate-400" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-slate-300" />
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
