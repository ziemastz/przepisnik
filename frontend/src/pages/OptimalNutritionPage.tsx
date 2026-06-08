import constants from '../constants';
import { Link } from '../router';
import optimalNutritionContent from '../content/optimalNutritionContent';

const OptimalNutritionPage = () => {
    return (
        <div className="optimal-nutrition-page">
            <section className="optimal-nutrition-hero">
                <div className="optimal-nutrition-hero-content">
                    <h1>{optimalNutritionContent.title}</h1>
                    <p>{optimalNutritionContent.subtitle}</p>
                </div>
            </section>

            <section className="optimal-nutrition-content">
                <article className="optimal-nutrition-card">
                    {optimalNutritionContent.introduction.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </article>

                <article className="optimal-nutrition-card">
                    <h2>{optimalNutritionContent.applicationsTitle}</h2>
                    {optimalNutritionContent.applications.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </article>

                <article className="optimal-nutrition-card">
                    <h2>{optimalNutritionContent.parameterTitle}</h2>
                    <p>
                        {optimalNutritionContent.parameterIntro}
                    </p>
                    <ol>
                        {optimalNutritionContent.parameterSteps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                    {optimalNutritionContent.parameterExamples.map((example) => (
                        <p key={example}>{example}</p>
                    ))}
                    <p className="optimal-nutrition-sources">{optimalNutritionContent.sourcesTitle}</p>
                    <ul className="optimal-nutrition-sources-list">
                        {optimalNutritionContent.sources.map((source) => (
                            <li key={source.href}>
                                {source.intro}{' '}
                                <a href={source.href} target="_blank" rel="noreferrer">
                                    {source.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </article>

                <div className="optimal-nutrition-actions">
                    <Link className="button secondary" to={constants.routes.home}>
                        {optimalNutritionContent.backToHomeLabel}
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default OptimalNutritionPage;
