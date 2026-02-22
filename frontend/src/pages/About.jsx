import React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@/components/ui/carousel";
import drpkd from "../assets/drpkd.png";
import anmol from "../assets/anmol.png";
import ekansh from "../assets/ekansh.png";
import gargi from "../assets/gargi.png";
import sandhya from "../assets/sandhya.png";
import urvashi from "../assets/urvassi.png";
import vaibhav from "../assets/vaibhav.png";
export default function About() {
	return (
		<main className="container mx-auto px-6 py-12">
			<section className="w-full mx-auto mb-10">
				<h1 className="text-4xl font-extrabold mb-4 text-center">About Pathfinder</h1>
				<p className="text-gray-700 leading-relaxed text-justify">
					Pathfinder, operating under the aegis of Brigupyari Seva Samiti and
					registered with the Society Registration Act 1860, is based in
					Lucknow and dedicated to promoting mental wellness, career clarity,
					and personality development for individuals of all ages.
				</p>
			</section>

			<section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
				<article className="p-6 bg-white rounded-lg shadow-sm text-justify">
					<h2 className="text-xl font-semibold mb-2">Our Services</h2>
					<ul className="text-gray-700 space-y-2">
						<li>Psychological counselling</li>
						<li>Career counselling & guidance</li>
						<li>Personality development workshops</li>
						<li>Workshops & seminars on social issues and gender sensitization</li>
						<li>Individual, family and online counselling options</li>
					</ul>
				</article>

				<article className="p-6 bg-white rounded-lg shadow-sm text-justify">
					<h2 className="text-xl font-semibold mb-2">Why Counselling Matters</h2>
					<p className="text-gray-700 leading-relaxed">
						In today’s landscape, there are noticeable gaps among parents,
						teachers, and peers around stream and career selection after a
						basic degree. A trained counselling psychologist can illuminate the
						best path forward by combining assessment, professional activities,
						and tailored counselling techniques to help a child or young
						adult meet their goals and ambitions.
					</p>
				</article>

				<article className="p-6 bg-white rounded-lg shadow-sm text-justify">
					<h2 className="text-xl font-semibold mb-2">Our Approach</h2>
					<p className="text-gray-700 leading-relaxed">
						Our team of counselling psychologists and counsellors addresses
						psychological, career, and mental health concerns with evidence-based
						methods. Techniques range from psychological counselling to
						psychotherapy, delivered through one-on-one sessions, family work,
						and online counselling when required.
					</p>
				</article>
			</section>

			<section className="w-full mb-12">
				<h2 className="text-2xl font-bold mb-4">Workshops & Community Programs</h2>
				<p className="text-gray-700 leading-relaxed mb-4 text-justify">
					We run focused workshops and seminars on career planning, personality
					development, societal wellness, social issues, and gender
					sensitization. Each program emphasizes the importance of counselling,
					practical strategies for stakeholders, and how early guidance can
					transform outcomes for young people.
				</p>
				<p className="text-gray-700 leading-relaxed text-justify">
					Pathfinder is committed to building awareness, equipping parents and
					educators, and supporting individuals to make informed choices that
					align with their strengths and aspirations.
				</p>
			</section>

			<section className="w-full mx-auto mb-12">
				<h2 className="text-2xl font-bold mb-6 text-center">Meet Our Team</h2>
				<Carousel>
					<CarouselContent className="items-stretch">
						{(() => {
							const members = [
								{
									name: 'Dr. Sandhya Dwivedi',
									role: 'Director | Psychologist | P.G.(Psy), PGDPC, MCA,Ph.D.',
									img: sandhya,
								},
								{
									name: 'Prof(Dr.) P.K. Dwivedi',
									role: 'Managing Director | Ph.D Mathematics',
									img: drpkd,
								},
                                {
									name: 'Ms. Gargi Dwivedi',
									role: 'Content Writer | Software Analyst',
									img: gargi,
								},
								{
									name: 'Ms. Urvashi',
									role: 'Program Manager at Pathfinder | SDE, Thales',
									img: urvashi,
								},{
									name: 'Mr. Vaibhav Shukla',
									role: 'IT Support Staff | SDE',
									img: vaibhav,
								}
								
							];
							const groups = [];
							for (let i = 0; i < members.length; i += 3) {
								groups.push(members.slice(i, i + 3));
							}
							return groups.map((group, idx) => (
								<CarouselItem key={idx}>
									<div className="mx-4 sm:mx-6 md:mx-8 lg:mx-0">
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
											{group.map((m) => (
												<div key={m.name} className="bg-white rounded-lg shadow-sm p-6 text-left">
													<div className="w-full h-76 mb-4 overflow-hidden rounded-md">
														<img src={m.img} alt={m.name} className="w-full h-full object-cover" />
													</div>
													<h3 className="text-lg font-semibold">{m.name}</h3>
													<p className="text-sm text-muted-foreground mb-2">{m.role}</p>
												</div>
											))}
										</div>
									</div>
								</CarouselItem>
							));
						})()}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</section>

			<section className="max-w-3xl mx-auto">
				<h3 className="text-xl font-semibold mb-3 text-center">Get Support</h3>
				<p className="text-gray-700 mb-6 text-justify">
					If you or someone you care about needs guidance or counselling, our
					team is ready to help with professional advice and compassionate
					support.
				</p>
				<div className="text-center">
					<a href="/contact" className="inline-block bg-sky-600 text-white px-6 py-3 rounded-md shadow hover:bg-sky-700">
						Contact Us
					</a>
				</div>
			</section>
		</main>
	);
}
