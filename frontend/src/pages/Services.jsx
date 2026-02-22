import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import drpkd from "../assets/drpkd.png";
import anmol from "../assets/anmol.png";
import ekansh from "../assets/ekansh.png";
import gargi from "../assets/gargi.png";
import sandhya from "../assets/sandhya.png";

export default function Services() {
  return (
    <main className="container mx-auto px-6 py-12 text-left">
            <div className="md:flex md:items-start md:gap-8">
                <div className="md:flex-1">
                    <section className="max-w-3xl mb-8 text-left">
                        <div className="md:flex md:items-start md:gap-8">

                            <div>
                                <h1 className="text-4xl font-extrabold mb-2">Our Services</h1>
                                {/* <div className="text-sm uppercase tracking-wide text-muted-foreground mb-4">SERVICES</div>
                                <p className="text-gray-700 leading-relaxed text-justify">How can I help you?</p> */}
                                <p className="text-gray-700 leading-relaxed mt-4 text-justify">
                                    Life is a challenge we have to accept it. To live a purposeful and
                                    successful life and to achieve a bright career, we have to develop
                                    our confidence. In the present scenario students face problems such
                                    as relationship crises, stress, fears, anxiety, family problems,
                                    adjustment issues, difficult decisions at work, depression and
                                    sadness. Pathfinder offers focused help to address these concerns.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="max-w-4xl grid gap-4 mb-12 text-left">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="personal">
                                <AccordionTrigger>
                                    <span className="text-lg font-semibold">Personal Counselling</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-gray-700 leading-relaxed text-justify">
                                        Personal counselling involves you and a counsellor working together
                                        to achieve your goals for change. The counselling process varies
                                        depending on the personalities of the counsellor and the client,
                                        and the particular concerns you bring forward.
                                    </p>
                                    <div className="mt-4">
                                        <Button asChild>
                                            <a href="/contact">Book a Session</a>
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <Separator />

                            <AccordionItem value="deaddiction">
                                <AccordionTrigger>
                                    <span className="text-lg font-semibold">De-addiction Counselling</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-gray-700 leading-relaxed text-justify">
                                        De-addiction is the process of overcoming addiction to alcohol,
                                        cannabis, cocaine and other psychotropic substances. A person
                                        suffering from substance abuse may experience depression or
                                        compulsive cravings; de-addiction counselling provides structured
                                        support to reduce dependence and rebuild healthy routines.
                                    </p>
                                    <div className="mt-4">
                                        <Button asChild>
                                            <a href="/contact">Get Help</a>
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <Separator />

                            <AccordionItem value="personality">
                                <AccordionTrigger>
                                    <span className="text-lg font-semibold">Personality & Skill Development</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-gray-700 leading-relaxed text-justify">
                                        Every individual has a unique set of behaviors, feelings and
                                        mannerisms. Personality development focuses on systematic emotional
                                        and behavioral growth that reflects an individual's strengths.
                                        Our programs work on communication, confidence, interpersonal
                                        skills and other competencies required for personal and professional success.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>

                            <Separator />

                            <AccordionItem value="career">
                                <AccordionTrigger>
                                    <span className="text-lg font-semibold">Career Counselling</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-gray-700 leading-relaxed text-justify">
                                        Career counselling gives advice and support to help clients manage
                                        their journey through education, learning and work. We assist with
                                        stream selection, aptitude alignment, decision-making and planning
                                        to build a meaningful, sustainable career path.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>

                            <Separator />

                            <AccordionItem value="tests">
                                <AccordionTrigger>
                                    <span className="text-lg font-semibold">Psychological Tests</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-gray-700 leading-relaxed text-justify">
                                        Psychological tests measure mental abilities and attributes that
                                        are not directly observable. They help identify underlying issues
                                        and guide targeted interventions — making it easier to diagnose
                                        and resolve emotional, cognitive and behavioral concerns.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    <section className="max-w-3xl text-left">
                        <a
                            href="/contact"
                            className="inline-block bg-sky-600 text-white px-6 py-3 rounded-md shadow hover:bg-sky-700"
                        >
                            Get In Touch
                        </a>
                    </section>
                </div>

                <div className="md:w-72 md:ml-8">
                    <Carousel orientation="vertical" plugins={[Autoplay({loop:true})]}>
                        <CarouselContent className="items-stretch h-screen">
                            {[sandhya, drpkd, anmol, ekansh, gargi].map((img, i) => (
                                <CarouselItem key={i} className="basis-auto">
                                    <div className="p-2">
                                        <img src={img} alt={`team-${i}`} className="w-full h-36 object-cover rounded-md shadow" />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
    </main>
  );
}
