---
layout: slides
title: "Sampling Methods"
category: "ai-engineering-course-step-01"
module_number: 16
complexity: "Build"
lesson_type: "Build"
lang_stack: "Python"
use_math: true
---
layout: true
class: basic-layout
---
class: center, middle, inverse-slide
# Step 01 - Math Foundations
## Module 16: Sampling Methods
### _Type: Build · Lang: Python · Time: ~120 minutes_
**Richardson Lima**
---
## The Journey Map
1. The problem framing and motivation.
2. Core mathematical intuition and geometry.
3. Formal equations and engineering interpretation.
4. AI system connections and production relevance.
5. Build path with practical implementation.
6. Mastery checkpoints and transfer to the next module.
---
## Why does this matter?
A language model finishes processing your prompt and produces a vector of 50,000 logits. One for every token in its vocabulary. Now it has to pick one. How?
If it always picks the highest-probability token, every response is identical. Deterministic. Boring. If it picks uniformly at random, the output is gibberish. The answer lives somewhere between these extremes, and that somewhere is controlled by sampling.
---
## Learning Objectives
- Implement inverse CDF, rejection, and importance sampling from scratch using only uniform random numbers
- Build temperature, top-k, and top-p (nucleus) sampling for language model token generation
- Explain the reparameterization trick and why it enables backpropagation through sampling in VAEs
- Run Metropolis-Hastings MCMC to sample from an unnormalized target distribution
---
## Why Sampling Matters
Sampling appears in four fundamental roles across AI and machine learning:
**Generation.** Language models, diffusion models, and GANs all produce output by sampling. The sampling algorithm directly controls creativity, coherence, and diversity. Temperature, top-k, and nucleus sampling are the knobs that engineers turn daily.
---
## Uniform Random Sampling
Every sampling method starts here. A uniform random number generator produces values in [0, 1) where every sub-interval of equal length has equal probability.
To sample uniformly from a discrete set of n items, generate U and return floor(n * U). To sample from a continuous range [a, b], compute a + (b - a) * U.
---
## Inverse CDF Method (Inverse Transform Sampling)
The cumulative distribution function (CDF) maps values to probabilities:
The inverse CDF maps probabilities back to values. If U ~ Uniform(0, 1), then X = F_inverse(U) follows the target distribution.
$$
X = F^{-1}(U), \quad U \sim \mathrm{Uniform}(0,1)
$$
---
## Rejection Sampling
When you cannot invert the CDF but can evaluate the target PDF up to a constant, rejection sampling works.
The tighter the bound M, the higher the acceptance rate. In low dimensions (1-3), rejection sampling works well. In high dimensions, the acceptance rate drops exponentially because most of the proposal volume gets rejected. This is the curse of dimensionality for rejection sampling.
Accept candidate $x \sim q(x)$ with probability:
$$
\alpha(x)=\frac{p(x)}{M q(x)}
$$
---
## Importance Sampling
Sometimes you do not need samples from the target distribution p(x). You need to estimate an expectation under p(x), and you have samples from a different distribution q(x).
This is critical in reinforcement learning. In PPO (Proximal Policy Optimization), you collect trajectories under an old policy pi_old but want to optimize a new policy pi_new. The importance weight is pi_new(a|s) / pi_old(a|s). PPO clips these weights to prevent the new policy from diverging too far from the old one.
$$
\mathbb{E}_{x\sim p}[f(x)] = \mathbb{E}_{x\sim q}\left[f(x)\frac{p(x)}{q(x)}\right]
$$
---
## Monte Carlo Estimation
Monte Carlo estimation approximates integrals by averaging random samples. The law of large numbers guarantees convergence.
The error rate is dimension-independent. This is why Monte Carlo methods dominate in high dimensions where grid-based integration is impossible.
$$
\hat{\mu}_N = \frac{1}{N}\sum_{i=1}^{N} f(x_i),\quad x_i\sim p(x)
$$
---
## Hands-on Build Path
1. Step 1: Uniform and inverse CDF sampling
2. Step 2: Rejection sampling
3. Step 3: Importance sampling
4. Step 4: Monte Carlo estimation of pi
5. Step 5: Metropolis-Hastings MCMC
6. Step 6: Gibbs sampling
Prerequisites: Phase 1, Lessons 06-07 (Probability, Bayes' Theorem)
---
## Mastery Checklist
- I can explain the concept without memorizing formulas.
- I can implement the minimal version in code.
- I can connect the topic to model training/inference.
- I can debug common errors in this topic.
---
## Wrap-up
This module connects mathematical intuition with practical execution.
Next step: move to the next module in the track and reinforce it with quiz exercises.
---

<!-- DEPTH_EXPANSION_START -->
---
class: middle, inverse-slide
# Depth Extension
### Full reference absorption plus beyond-reference advanced coverage

---
## Reference Absorption: The Problem
- A language model finishes processing your prompt and produces a vector of 50,000 logits.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (a language model finishes processing your prompt and produces a vector of 50,000 logits).
- Operational risk check: define a metric and alert tied to this concept before deployment (a language model finishes processing your prompt and produces a vector of 50,000 logits).
- One for every token in its vocabulary.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (one for every token in its vocabulary).
- Operational risk check: define a metric and alert tied to this concept before deployment (one for every token in its vocabulary).
- If it always picks the highest-probability token, every response is identical.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if it always picks the highest-probability token, every response is identical).
- Operational risk check: define a metric and alert tied to this concept before deployment (if it always picks the highest-probability token, every response is identical).
- If it picks uniformly at random, the output is gibberish.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if it picks uniformly at random, the output is gibberish).
- Operational risk check: define a metric and alert tied to this concept before deployment (if it picks uniformly at random, the output is gibberish).

---
## Reference Absorption: The Problem (cont.)
- The answer lives somewhere between these extremes, and that somewhere is controlled by sampling.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the answer lives somewhere between these extremes, and that somewhere is controlled by sampling).
- Operational risk check: define a metric and alert tied to this concept before deployment (the answer lives somewhere between these extremes, and that somewhere is controlled by sampling).
- Sampling is not limited to text generation.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (sampling is not limited to text generation).
- Operational risk check: define a metric and alert tied to this concept before deployment (sampling is not limited to text generation).
- Reinforcement learning estimates policy gradients by sampling trajectories.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (reinforcement learning estimates policy gradients by sampling trajectories).
- Operational risk check: define a metric and alert tied to this concept before deployment (reinforcement learning estimates policy gradients by sampling trajectories).
- VAEs learn latent representations by sampling from learned distributions and backpropagating through the randomness.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (vaes learn latent representations by sampling from learned distributions and backpropagating through the randomness).
- Operational risk check: define a metric and alert tied to this concept before deployment (vaes learn latent representations by sampling from learned distributions and backpropagating through the randomness).

---
## Reference Absorption: The Problem Deep Continuation
- Diffusion models generate images by sampling noise and iteratively denoising.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (diffusion models generate images by sampling noise and iteratively denoising).
- Operational risk check: define a metric and alert tied to this concept before deployment (diffusion models generate images by sampling noise and iteratively denoising).
- Monte Carlo methods estimate integrals that have no closed-form solution.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (monte carlo methods estimate integrals that have no closed-form solution).
- Operational risk check: define a metric and alert tied to this concept before deployment (monte carlo methods estimate integrals that have no closed-form solution).
- MCMC algorithms explore high-dimensional posterior distributions that are impossible to enumerate.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (mcmc algorithms explore high-dimensional posterior distributions that are impossible to enumerate).
- Operational risk check: define a metric and alert tied to this concept before deployment (mcmc algorithms explore high-dimensional posterior distributions that are impossible to enumerate).
- Every generative AI system is a sampling system.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (every generative ai system is a sampling system).
- Operational risk check: define a metric and alert tied to this concept before deployment (every generative ai system is a sampling system).

---
## Reference Absorption: The Problem Deep Continuation
- The sampling strategy determines the quality, diversity, and controllability of the output.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the sampling strategy determines the quality, diversity, and controllability of the output).
- Operational risk check: define a metric and alert tied to this concept before deployment (the sampling strategy determines the quality, diversity, and controllability of the output).
- This lesson builds every major sampling method from scratch, starting from uniform random numbers and ending with the techniques that power modern LLMs and generative models.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this lesson builds every major sampling method from scratch, starting from uniform random numbers and ending with the technique...).
- Operational risk check: define a metric and alert tied to this concept before deployment (this lesson builds every major sampling method from scratch, starting from uniform random numbers and ending with the...).

---
## Reference Absorption: Exercises
- Implement inverse CDF sampling for the Cauchy distribution.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (implement inverse cdf sampling for the cauchy distribution).
- Operational risk check: define a metric and alert tied to this concept before deployment (implement inverse cdf sampling for the cauchy distribution).
- The CDF is F(x) = 0.5 + arctan(x)/pi.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the cdf is f(x) = 0.5 + arctan(x)/pi).
- Operational risk check: define a metric and alert tied to this concept before deployment (the cdf is f(x) = 0.5 + arctan(x)/pi).
- Generate 10,000 samples and plot the histogram against the true PDF.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (generate 10,000 samples and plot the histogram against the true pdf).
- Operational risk check: define a metric and alert tied to this concept before deployment (generate 10,000 samples and plot the histogram against the true pdf).
- Notice the heavy tails (extreme values far from center).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (notice the heavy tails (extreme values far from center)).
- Operational risk check: define a metric and alert tied to this concept before deployment (notice the heavy tails (extreme values far from center)).

---
## Reference Absorption: Exercises (cont.)
- Use rejection sampling to generate samples from a Beta(2, 5) distribution using a Uniform(0, 1) proposal.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (use rejection sampling to generate samples from a beta(2, 5) distribution using a uniform(0, 1) proposal).
- Operational risk check: define a metric and alert tied to this concept before deployment (use rejection sampling to generate samples from a beta(2, 5) distribution using a uniform(0, 1) proposal).
- Plot the accepted samples against the true Beta PDF.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (plot the accepted samples against the true beta pdf).
- Operational risk check: define a metric and alert tied to this concept before deployment (plot the accepted samples against the true beta pdf).
- What is the theoretical acceptance rate?
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (what is the theoretical acceptance rate?).
- Operational risk check: define a metric and alert tied to this concept before deployment (what is the theoretical acceptance rate?).
- Estimate the integral of sin(x) from 0 to pi using Monte Carlo with 1,000, 10,000, and 100,000 samples.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (estimate the integral of sin(x) from 0 to pi using monte carlo with 1,000, 10,000, and 100,000 samples).
- Operational risk check: define a metric and alert tied to this concept before deployment (estimate the integral of sin(x) from 0 to pi using monte carlo with 1,000, 10,000, and 100,000 samples).

---
## Reference Absorption: Exercises Deep Continuation
- Compare the error at each level.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (compare the error at each level).
- Operational risk check: define a metric and alert tied to this concept before deployment (compare the error at each level).
- Verify that the error scales as O(1/sqrt(N)).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (verify that the error scales as o(1/sqrt(n))).
- Operational risk check: define a metric and alert tied to this concept before deployment (verify that the error scales as o(1/sqrt(n))).
- Implement Metropolis-Hastings to sample from a 2D distribution p(x, y) proportional to exp(-(x^2 * y^2 + x^2 + y^2 - 8*x - 8*y) / 2).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (implement metropolis-hastings to sample from a 2d distribution p(x, y) proportional to exp(-(x^2 * y^2 + x^2 + y^2 - 8*x - 8*y)...).
- Operational risk check: define a metric and alert tied to this concept before deployment (implement metropolis-hastings to sample from a 2d distribution p(x, y) proportional to exp(-(x^2 * y^2 + x^2 + y^2 -...).
- Plot the samples and the chain trajectory.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (plot the samples and the chain trajectory).
- Operational risk check: define a metric and alert tied to this concept before deployment (plot the samples and the chain trajectory).

---
## Reference Absorption: Exercises Deep Continuation
- Experiment with different proposal standard deviations.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (experiment with different proposal standard deviations).
- Operational risk check: define a metric and alert tied to this concept before deployment (experiment with different proposal standard deviations).
- Build a complete text generation demo: given a vocabulary of 10 words with logits, generate sequences of 20 tokens using (a) greedy, (b) temperature=0.7, (c) top-k=3, (d) top-p=0.9.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (build a complete text generation demo: given a vocabulary of 10 words with logits, generate sequences of 20 tokens using (a) gr...).
- Operational risk check: define a metric and alert tied to this concept before deployment (build a complete text generation demo: given a vocabulary of 10 words with logits, generate sequences of 20 tokens us...).
- Compare the diversity of outputs across 5 runs.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (compare the diversity of outputs across 5 runs).
- Operational risk check: define a metric and alert tied to this concept before deployment (compare the diversity of outputs across 5 runs).

---
## Reference Absorption: Key Terms
- The mechanism behind all generative AI |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the mechanism behind all generative ai |).
- Operational risk check: define a metric and alert tied to this concept before deployment (the mechanism behind all generative ai |).
- The starting point for all sampling methods |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the starting point for all sampling methods |).
- Operational risk check: define a metric and alert tied to this concept before deployment (the starting point for all sampling methods |).
- Error O(1/sqrt(N)) regardless of dimension |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (error o(1/sqrt(n)) regardless of dimension |).
- Operational risk check: define a metric and alert tied to this concept before deployment (error o(1/sqrt(n)) regardless of dimension |).
- Metropolis-Hastings is the foundational algorithm |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (metropolis-hastings is the foundational algorithm |).
- Operational risk check: define a metric and alert tied to this concept before deployment (metropolis-hastings is the foundational algorithm |).

---
## Reference Absorption: Key Terms (cont.)
- Detailed balance ensures convergence to target distribution |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (detailed balance ensures convergence to target distribution |).
- Operational risk check: define a metric and alert tied to this concept before deployment (detailed balance ensures convergence to target distribution |).
- T<1 sharpens (more confident), T>1 flattens (more diverse) |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (t<1 sharpens (more confident), t>1 flattens (more diverse) |).
- Operational risk check: define a metric and alert tied to this concept before deployment (t<1 sharpens (more confident), t>1 flattens (more diverse) |).
- Adaptive candidate set size |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (adaptive candidate set size |).
- Operational risk check: define a metric and alert tied to this concept before deployment (adaptive candidate set size |).
- Makes sampling differentiable.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (makes sampling differentiable).
- Operational risk check: define a metric and alert tied to this concept before deployment (makes sampling differentiable).

---
## Reference Absorption: Key Terms Deep Continuation
- Essential for VAE training |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (essential for vae training |).
- Operational risk check: define a metric and alert tied to this concept before deployment (essential for vae training |).
- Always lower variance than naive Monte Carlo |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (always lower variance than naive monte carlo |).
- Operational risk check: define a metric and alert tied to this concept before deployment (always lower variance than naive monte carlo |).
- Sufficient condition for p to be the stationary distribution of a Markov chain |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (sufficient condition for p to be the stationary distribution of a markov chain |).
- Operational risk check: define a metric and alert tied to this concept before deployment (sufficient condition for p to be the stationary distribution of a markov chain |).
- Each step is a conditional sampling operation |
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (each step is a conditional sampling operation |).
- Operational risk check: define a metric and alert tied to this concept before deployment (each step is a conditional sampling operation |).

---
## Reference Absorption: Markov Chain Monte Carlo (MCMC): Metropolis-Hastings
- MCMC constructs a Markov chain whose stationary distribution is the target distribution p(x).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (mcmc constructs a markov chain whose stationary distribution is the target distribution p(x)).
- Operational risk check: define a metric and alert tied to this concept before deployment (mcmc constructs a markov chain whose stationary distribution is the target distribution p(x)).
- After enough steps, samples from the chain are (approximately) samples from p(x).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (after enough steps, samples from the chain are (approximately) samples from p(x)).
- Operational risk check: define a metric and alert tied to this concept before deployment (after enough steps, samples from the chain are (approximately) samples from p(x)).
- This is the original Metropolis algorithm.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is the original metropolis algorithm).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is the original metropolis algorithm).
- Why it works. The acceptance rule ensures detailed balance: the probability of being at x and moving to x' equals the probability of being at x' and moving to x.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (why it works. the acceptance rule ensures detailed balance: the probability of being at x and moving to x' equals the probabili...).
- Operational risk check: define a metric and alert tied to this concept before deployment (why it works. the acceptance rule ensures detailed balance: the probability of being at x and moving to x' equals the...).

---
## Reference Absorption: Markov Chain Monte Carlo (MCMC): Metropolis-Hastings (cont.)
- Detailed balance implies that p(x) is the stationary distribution of the chain.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (detailed balance implies that p(x) is the stationary distribution of the chain).
- Operational risk check: define a metric and alert tied to this concept before deployment (detailed balance implies that p(x) is the stationary distribution of the chain).
- Burn-in: discard early samples before the chain reaches equilibrium
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (burn-in: discard early samples before the chain reaches equilibrium).
- Operational risk check: define a metric and alert tied to this concept before deployment (burn-in: discard early samples before the chain reaches equilibrium).
- Thinning: keep every k-th sample to reduce autocorrelation
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (thinning: keep every k-th sample to reduce autocorrelation).
- Operational risk check: define a metric and alert tied to this concept before deployment (thinning: keep every k-th sample to reduce autocorrelation).
- Proposal scale: too small and the chain moves slowly (high acceptance, slow exploration); too large and most proposals are rejected (low acceptance, stuck in place)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (proposal scale: too small and the chain moves slowly (high acceptance, slow exploration); too large and most proposals are reje...).
- Operational risk check: define a metric and alert tied to this concept before deployment (proposal scale: too small and the chain moves slowly (high acceptance, slow exploration); too large and most proposal...).

---
## Reference Absorption: Markov Chain Monte Carlo (MCMC): Metropolis-Hastings Deep Continuation
- The optimal acceptance rate for a Gaussian proposal in high dimensions is approximately 0.234
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the optimal acceptance rate for a gaussian proposal in high dimensions is approximately 0.234).
- Operational risk check: define a metric and alert tied to this concept before deployment (the optimal acceptance rate for a gaussian proposal in high dimensions is approximately 0.234).

---
## Reference Absorption: Gumbel-Softmax (Differentiable Categorical Sampling)
- The reparameterization trick works for continuous distributions (Gaussian).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the reparameterization trick works for continuous distributions (gaussian)).
- Operational risk check: define a metric and alert tied to this concept before deployment (the reparameterization trick works for continuous distributions (gaussian)).
- For discrete categorical distributions, we need a different approach.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (for discrete categorical distributions, we need a different approach).
- Operational risk check: define a metric and alert tied to this concept before deployment (for discrete categorical distributions, we need a different approach).
- Gumbel-Softmax provides a differentiable approximation to categorical sampling.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (gumbel-softmax provides a differentiable approximation to categorical sampling).
- Operational risk check: define a metric and alert tied to this concept before deployment (gumbel-softmax provides a differentiable approximation to categorical sampling).
- The Gumbel-Max trick (non-differentiable):
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the gumbel-max trick (non-differentiable):).
- Operational risk check: define a metric and alert tied to this concept before deployment (the gumbel-max trick (non-differentiable):).

---
## Reference Absorption: Gumbel-Softmax (Differentiable Categorical Sampling) (cont.)
- Gumbel-Softmax (differentiable approximation):
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (gumbel-softmax (differentiable approximation):).
- Operational risk check: define a metric and alert tied to this concept before deployment (gumbel-softmax (differentiable approximation):).
- Gumbel-Softmax produces a continuous relaxation of a discrete sample.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (gumbel-softmax produces a continuous relaxation of a discrete sample).
- Operational risk check: define a metric and alert tied to this concept before deployment (gumbel-softmax produces a continuous relaxation of a discrete sample).
- The output is a probability vector (soft one-hot) instead of a hard one-hot.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the output is a probability vector (soft one-hot) instead of a hard one-hot).
- Operational risk check: define a metric and alert tied to this concept before deployment (the output is a probability vector (soft one-hot) instead of a hard one-hot).
- Gradients flow through the softmax.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (gradients flow through the softmax).
- Operational risk check: define a metric and alert tied to this concept before deployment (gradients flow through the softmax).

---
## Reference Absorption: Gumbel-Softmax (Differentiable Categorical Sampling) Deep Continuation
- During the forward pass in training, you can use the "straight-through" estimator: use the hard argmax for the forward pass but the soft Gumbel-Softmax gradients for the backward pass.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (during the forward pass in training, you can use the "straight-through" estimator: use the hard argmax for the forward pass but...).
- Operational risk check: define a metric and alert tied to this concept before deployment (during the forward pass in training, you can use the "straight-through" estimator: use the hard argmax for the forwar...).
- Discrete latent variables in VAEs
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (discrete latent variables in vaes).
- Operational risk check: define a metric and alert tied to this concept before deployment (discrete latent variables in vaes).
- Neural architecture search (choosing discrete operations)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (neural architecture search (choosing discrete operations)).
- Operational risk check: define a metric and alert tied to this concept before deployment (neural architecture search (choosing discrete operations)).
- Reinforcement learning with discrete actions
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (reinforcement learning with discrete actions).
- Operational risk check: define a metric and alert tied to this concept before deployment (reinforcement learning with discrete actions).

---
## Reference Absorption: Reparameterization Trick (Used in VAEs)
- Variational autoencoders (VAEs) learn by encoding inputs into a distribution in latent space, sampling from that distribution, and decoding the sample back.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (variational autoencoders (vaes) learn by encoding inputs into a distribution in latent space, sampling from that distribution,...).
- Operational risk check: define a metric and alert tied to this concept before deployment (variational autoencoders (vaes) learn by encoding inputs into a distribution in latent space, sampling from that dist...).
- The problem: you cannot backpropagate through a sampling operation.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the problem: you cannot backpropagate through a sampling operation).
- Operational risk check: define a metric and alert tied to this concept before deployment (the problem: you cannot backpropagate through a sampling operation).
- The reparameterization trick separates the randomness from the parameters:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the reparameterization trick separates the randomness from the parameters:).
- Operational risk check: define a metric and alert tied to this concept before deployment (the reparameterization trick separates the randomness from the parameters:).
- This works because N(mu, sigma^2) has the same distribution as mu + sigma * N(0, 1).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this works because n(mu, sigma^2) has the same distribution as mu + sigma * n(0, 1)).
- Operational risk check: define a metric and alert tied to this concept before deployment (this works because n(mu, sigma^2) has the same distribution as mu + sigma * n(0, 1)).

---
## Reference Absorption: Reparameterization Trick (Used in VAEs) (cont.)
- The key insight: move the randomness to a parameter-free source (epsilon), then express the sample as a differentiable transformation of the parameters.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the key insight: move the randomness to a parameter-free source (epsilon), then express the sample as a differentiable transfor...).
- Operational risk check: define a metric and alert tied to this concept before deployment (the key insight: move the randomness to a parameter-free source (epsilon), then express the sample as a differentiabl...).
- Encoder outputs mu and log(sigma^2) for each input
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (encoder outputs mu and log(sigma^2) for each input).
- Operational risk check: define a metric and alert tied to this concept before deployment (encoder outputs mu and log(sigma^2) for each input).
- Compute z = mu + sigma * epsilon
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (compute z = mu + sigma * epsilon).
- Operational risk check: define a metric and alert tied to this concept before deployment (compute z = mu + sigma * epsilon).
- Decode z to reconstruct the input
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (decode z to reconstruct the input).
- Operational risk check: define a metric and alert tied to this concept before deployment (decode z to reconstruct the input).

---
## Reference Absorption: Reparameterization Trick (Used in VAEs) Deep Continuation
- Backpropagate through steps 4, 3, 2, 1 (possible because step 3 is differentiable)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (backpropagate through steps 4, 3, 2, 1 (possible because step 3 is differentiable)).
- Operational risk check: define a metric and alert tied to this concept before deployment (backpropagate through steps 4, 3, 2, 1 (possible because step 3 is differentiable)).
- Without the reparameterization trick, VAEs cannot be trained with standard backpropagation.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (without the reparameterization trick, vaes cannot be trained with standard backpropagation).
- Operational risk check: define a metric and alert tied to this concept before deployment (without the reparameterization trick, vaes cannot be trained with standard backpropagation).
- This single insight made VAEs practical.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this single insight made vaes practical).
- Operational risk check: define a metric and alert tied to this concept before deployment (this single insight made vaes practical).

---
## Reference Absorption: Why Sampling Matters
- Sampling appears in four fundamental roles across AI and machine learning:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (sampling appears in four fundamental roles across ai and machine learning:).
- Operational risk check: define a metric and alert tied to this concept before deployment (sampling appears in four fundamental roles across ai and machine learning:).
- Generation. Language models, diffusion models, and GANs all produce output by sampling.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (generation. language models, diffusion models, and gans all produce output by sampling).
- Operational risk check: define a metric and alert tied to this concept before deployment (generation. language models, diffusion models, and gans all produce output by sampling).
- The sampling algorithm directly controls creativity, coherence, and diversity.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the sampling algorithm directly controls creativity, coherence, and diversity).
- Operational risk check: define a metric and alert tied to this concept before deployment (the sampling algorithm directly controls creativity, coherence, and diversity).
- Temperature, top-k, and nucleus sampling are the knobs that engineers turn daily.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (temperature, top-k, and nucleus sampling are the knobs that engineers turn daily).
- Operational risk check: define a metric and alert tied to this concept before deployment (temperature, top-k, and nucleus sampling are the knobs that engineers turn daily).

---
## Reference Absorption: Why Sampling Matters (cont.)
- Training. Stochastic gradient descent samples mini-batches.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (training. stochastic gradient descent samples mini-batches).
- Operational risk check: define a metric and alert tied to this concept before deployment (training. stochastic gradient descent samples mini-batches).
- Dropout samples neurons to deactivate.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (dropout samples neurons to deactivate).
- Operational risk check: define a metric and alert tied to this concept before deployment (dropout samples neurons to deactivate).
- Data augmentation samples random transformations.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (data augmentation samples random transformations).
- Operational risk check: define a metric and alert tied to this concept before deployment (data augmentation samples random transformations).
- Importance sampling reweights samples to reduce gradient variance in reinforcement learning (PPO, TRPO).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (importance sampling reweights samples to reduce gradient variance in reinforcement learning (ppo, trpo)).
- Operational risk check: define a metric and alert tied to this concept before deployment (importance sampling reweights samples to reduce gradient variance in reinforcement learning (ppo, trpo)).

---
## Reference Absorption: Why Sampling Matters Deep Continuation
- Estimation. Many quantities in ML have no closed-form solution.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (estimation. many quantities in ml have no closed-form solution).
- Operational risk check: define a metric and alert tied to this concept before deployment (estimation. many quantities in ml have no closed-form solution).
- The expected loss over a data distribution, the partition function of an energy-based model, the evidence in Bayesian inference.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the expected loss over a data distribution, the partition function of an energy-based model, the evidence in bayesian inference).
- Operational risk check: define a metric and alert tied to this concept before deployment (the expected loss over a data distribution, the partition function of an energy-based model, the evidence in bayesian...).
- Monte Carlo estimation approximates all of these by averaging over samples.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (monte carlo estimation approximates all of these by averaging over samples).
- Operational risk check: define a metric and alert tied to this concept before deployment (monte carlo estimation approximates all of these by averaging over samples).
- Exploration. MCMC algorithms explore posterior distributions in Bayesian inference.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (exploration. mcmc algorithms explore posterior distributions in bayesian inference).
- Operational risk check: define a metric and alert tied to this concept before deployment (exploration. mcmc algorithms explore posterior distributions in bayesian inference).

---
## Reference Absorption: Why Sampling Matters Deep Continuation
- Evolutionary strategies sample parameter perturbations.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (evolutionary strategies sample parameter perturbations).
- Operational risk check: define a metric and alert tied to this concept before deployment (evolutionary strategies sample parameter perturbations).
- Thompson sampling balances exploration and exploitation in bandits.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (thompson sampling balances exploration and exploitation in bandits).
- Operational risk check: define a metric and alert tied to this concept before deployment (thompson sampling balances exploration and exploitation in bandits).
- The core challenge: you can only sample directly from simple distributions (uniform, normal).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the core challenge: you can only sample directly from simple distributions (uniform, normal)).
- Operational risk check: define a metric and alert tied to this concept before deployment (the core challenge: you can only sample directly from simple distributions (uniform, normal)).
- For everything else, you need a method to convert simple samples into samples from your target distribution.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (for everything else, you need a method to convert simple samples into samples from your target distribution).
- Operational risk check: define a metric and alert tied to this concept before deployment (for everything else, you need a method to convert simple samples into samples from your target distribution).

---
## Reference Absorption: Connection to Diffusion Models
- Diffusion models generate images through a sampling process.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (diffusion models generate images through a sampling process).
- Operational risk check: define a metric and alert tied to this concept before deployment (diffusion models generate images through a sampling process).
- The forward process adds Gaussian noise to an image over T steps until it becomes pure noise.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the forward process adds gaussian noise to an image over t steps until it becomes pure noise).
- Operational risk check: define a metric and alert tied to this concept before deployment (the forward process adds gaussian noise to an image over t steps until it becomes pure noise).
- The reverse process learns to denoise, recovering the original image step by step.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the reverse process learns to denoise, recovering the original image step by step).
- Operational risk check: define a metric and alert tied to this concept before deployment (the reverse process learns to denoise, recovering the original image step by step).
- The connection to the methods in this lesson:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the connection to the methods in this lesson:).
- Operational risk check: define a metric and alert tied to this concept before deployment (the connection to the methods in this lesson:).

---
## Reference Absorption: Connection to Diffusion Models (cont.)
- Each denoising step uses the reparameterization trick (sample noise, apply deterministic transform)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (each denoising step uses the reparameterization trick (sample noise, apply deterministic transform)).
- Operational risk check: define a metric and alert tied to this concept before deployment (each denoising step uses the reparameterization trick (sample noise, apply deterministic transform)).
- The noise schedule {alpha_t} controls a form of temperature annealing
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the noise schedule {alpha_t} controls a form of temperature annealing).
- Operational risk check: define a metric and alert tied to this concept before deployment (the noise schedule {alpha_t} controls a form of temperature annealing).
- Training uses Monte Carlo estimation to approximate the ELBO (evidence lower bound)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (training uses monte carlo estimation to approximate the elbo (evidence lower bound)).
- Operational risk check: define a metric and alert tied to this concept before deployment (training uses monte carlo estimation to approximate the elbo (evidence lower bound)).
- Ancestral sampling in diffusion models is a Markov chain (each step depends only on the current state)
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (ancestral sampling in diffusion models is a markov chain (each step depends only on the current state)).
- Operational risk check: define a metric and alert tied to this concept before deployment (ancestral sampling in diffusion models is a markov chain (each step depends only on the current state)).

---
## Reference Absorption: Connection to Diffusion Models Deep Continuation
- The entire image generation process is iterative sampling: start from noise, and at each step, sample a slightly less noisy version conditioned on the learned denoising model.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the entire image generation process is iterative sampling: start from noise, and at each step, sample a slightly less noisy ver...).
- Operational risk check: define a metric and alert tied to this concept before deployment (the entire image generation process is iterative sampling: start from noise, and at each step, sample a slightly less...).

---
## Reference Absorption: Inverse CDF Method (Inverse Transform Sampling)
- The cumulative distribution function (CDF) maps values to probabilities:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the cumulative distribution function (cdf) maps values to probabilities:).
- Operational risk check: define a metric and alert tied to this concept before deployment (the cumulative distribution function (cdf) maps values to probabilities:).
- The inverse CDF maps probabilities back to values.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the inverse cdf maps probabilities back to values).
- Operational risk check: define a metric and alert tied to this concept before deployment (the inverse cdf maps probabilities back to values).
- If U ~ Uniform(0, 1), then X = F_inverse(U) follows the target distribution.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if u ~ uniform(0, 1), then x = f_inverse(u) follows the target distribution).
- Operational risk check: define a metric and alert tied to this concept before deployment (if u ~ uniform(0, 1), then x = f_inverse(u) follows the target distribution).
- Exponential distribution example:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (exponential distribution example:).
- Operational risk check: define a metric and alert tied to this concept before deployment (exponential distribution example:).

---
## Reference Absorption: Inverse CDF Method (Inverse Transform Sampling) (cont.)
- This works perfectly when you can write down F_inverse in closed form.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this works perfectly when you can write down f_inverse in closed form).
- Operational risk check: define a metric and alert tied to this concept before deployment (this works perfectly when you can write down f_inverse in closed form).
- For the normal distribution, there is no closed-form inverse CDF, so we use other methods (Box-Muller, or numerical approximation).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (for the normal distribution, there is no closed-form inverse cdf, so we use other methods (box-muller, or numerical approximation)).
- Operational risk check: define a metric and alert tied to this concept before deployment (for the normal distribution, there is no closed-form inverse cdf, so we use other methods (box-muller, or numerical a...).
- Discrete version: For discrete distributions, build the CDF as a cumulative sum, generate U, and find the first index where the cumulative sum exceeds U.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (discrete version: for discrete distributions, build the cdf as a cumulative sum, generate u, and find the first index where the...).
- Operational risk check: define a metric and alert tied to this concept before deployment (discrete version: for discrete distributions, build the cdf as a cumulative sum, generate u, and find the first index...).
- This is how sample_categorical works in Lesson 06.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is how sample_categorical works in lesson 06).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is how sample_categorical works in lesson 06).

---
## Reference Absorption: Temperature Sampling (Used in LLMs)
- Language models output logits z_1, ..., z_V for each token in the vocabulary.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (language models output logits z_1, ..., z_v for each token in the vocabulary).
- Operational risk check: define a metric and alert tied to this concept before deployment (language models output logits z_1, ..., z_v for each token in the vocabulary).
- Softmax converts these to probabilities.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (softmax converts these to probabilities).
- Operational risk check: define a metric and alert tied to this concept before deployment (softmax converts these to probabilities).
- Temperature rescales the logits before softmax:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (temperature rescales the logits before softmax:).
- Operational risk check: define a metric and alert tied to this concept before deployment (temperature rescales the logits before softmax:).
- Why it works. Dividing logits by T < 1 amplifies differences between logits.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (why it works. dividing logits by t < 1 amplifies differences between logits).
- Operational risk check: define a metric and alert tied to this concept before deployment (why it works. dividing logits by t < 1 amplifies differences between logits).

---
## Reference Absorption: Temperature Sampling (Used in LLMs) (cont.)
- If z_1 = 2 and z_2 = 1, dividing by T = 0.5 gives z_1/T = 4 and z_2/T = 2, making the gap larger.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if z_1 = 2 and z_2 = 1, dividing by t = 0.5 gives z_1/t = 4 and z_2/t = 2, making the gap larger).
- Operational risk check: define a metric and alert tied to this concept before deployment (if z_1 = 2 and z_2 = 1, dividing by t = 0.5 gives z_1/t = 4 and z_2/t = 2, making the gap larger).
- After softmax, the highest-logit token gets a much larger share.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (after softmax, the highest-logit token gets a much larger share).
- Operational risk check: define a metric and alert tied to this concept before deployment (after softmax, the highest-logit token gets a much larger share).
- T = 0.0: greedy decoding, best for factual Q&A
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (t = 0.0: greedy decoding, best for factual q&a).
- Operational risk check: define a metric and alert tied to this concept before deployment (t = 0.0: greedy decoding, best for factual q&a).
- T = 0.3-0.7: slightly creative, good for code generation
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (t = 0.3-0.7: slightly creative, good for code generation).
- Operational risk check: define a metric and alert tied to this concept before deployment (t = 0.3-0.7: slightly creative, good for code generation).

---
## Reference Absorption: Temperature Sampling (Used in LLMs) Deep Continuation
- T = 0.7-1.0: balanced, good for general conversation
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (t = 0.7-1.0: balanced, good for general conversation).
- Operational risk check: define a metric and alert tied to this concept before deployment (t = 0.7-1.0: balanced, good for general conversation).
- T = 1.0-1.5: creative writing, brainstorming
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (t = 1.0-1.5: creative writing, brainstorming).
- Operational risk check: define a metric and alert tied to this concept before deployment (t = 1.0-1.5: creative writing, brainstorming).
- T > 1.5: increasingly random, rarely useful
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (t > 1.5: increasingly random, rarely useful).
- Operational risk check: define a metric and alert tied to this concept before deployment (t > 1.5: increasingly random, rarely useful).
- Temperature does not change which tokens are possible.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (temperature does not change which tokens are possible).
- Operational risk check: define a metric and alert tied to this concept before deployment (temperature does not change which tokens are possible).

---
## Reference Absorption: Temperature Sampling (Used in LLMs) Deep Continuation
- It changes the probability mass allocated to each token.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (it changes the probability mass allocated to each token).
- Operational risk check: define a metric and alert tied to this concept before deployment (it changes the probability mass allocated to each token).

---
## Reference Absorption: Gibbs Sampling
- Gibbs sampling is a special case of MCMC for multivariate distributions.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (gibbs sampling is a special case of mcmc for multivariate distributions).
- Operational risk check: define a metric and alert tied to this concept before deployment (gibbs sampling is a special case of mcmc for multivariate distributions).
- Instead of proposing a move in all dimensions at once, it updates one variable at a time from its conditional distribution.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (instead of proposing a move in all dimensions at once, it updates one variable at a time from its conditional distribution).
- Operational risk check: define a metric and alert tied to this concept before deployment (instead of proposing a move in all dimensions at once, it updates one variable at a time from its conditional distrib...).
- Gibbs sampling requires that you can sample from each conditional distribution p(x_i | x_{-i}).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (gibbs sampling requires that you can sample from each conditional distribution p(x_i | x_{-i})).
- Operational risk check: define a metric and alert tied to this concept before deployment (gibbs sampling requires that you can sample from each conditional distribution p(x_i | x_{-i})).
- This is straightforward for many models:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is straightforward for many models:).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is straightforward for many models:).

---
## Reference Absorption: Gibbs Sampling (cont.)
- Bayesian networks: conditionals follow from the graph structure
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (bayesian networks: conditionals follow from the graph structure).
- Operational risk check: define a metric and alert tied to this concept before deployment (bayesian networks: conditionals follow from the graph structure).
- Gaussian mixtures: conditionals are Gaussian
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (gaussian mixtures: conditionals are gaussian).
- Operational risk check: define a metric and alert tied to this concept before deployment (gaussian mixtures: conditionals are gaussian).
- Ising models: each spin's conditional depends only on its neighbors
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (ising models: each spin's conditional depends only on its neighbors).
- Operational risk check: define a metric and alert tied to this concept before deployment (ising models: each spin's conditional depends only on its neighbors).
- The acceptance rate is always 1 (every proposal is accepted) because sampling from the exact conditional automatically satisfies detailed balance.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the acceptance rate is always 1 (every proposal is accepted) because sampling from the exact conditional automatically satisfie...).
- Operational risk check: define a metric and alert tied to this concept before deployment (the acceptance rate is always 1 (every proposal is accepted) because sampling from the exact conditional automaticall...).

---
## Reference Absorption: Gibbs Sampling Deep Continuation
- Limitation. When variables are highly correlated, Gibbs sampling mixes slowly because updating one variable at a time cannot make large diagonal moves through the distribution.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (limitation. when variables are highly correlated, gibbs sampling mixes slowly because updating one variable at a time cannot ma...).
- Operational risk check: define a metric and alert tied to this concept before deployment (limitation. when variables are highly correlated, gibbs sampling mixes slowly because updating one variable at a time...).

---
## Reference Absorption: Rejection Sampling
- When you cannot invert the CDF but can evaluate the target PDF up to a constant, rejection sampling works.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (when you cannot invert the cdf but can evaluate the target pdf up to a constant, rejection sampling works).
- Operational risk check: define a metric and alert tied to this concept before deployment (when you cannot invert the cdf but can evaluate the target pdf up to a constant, rejection sampling works).
- The tighter the bound M, the higher the acceptance rate.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the tighter the bound m, the higher the acceptance rate).
- Operational risk check: define a metric and alert tied to this concept before deployment (the tighter the bound m, the higher the acceptance rate).
- In low dimensions (1-3), rejection sampling works well.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in low dimensions (1-3), rejection sampling works well).
- Operational risk check: define a metric and alert tied to this concept before deployment (in low dimensions (1-3), rejection sampling works well).
- In high dimensions, the acceptance rate drops exponentially because most of the proposal volume gets rejected.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in high dimensions, the acceptance rate drops exponentially because most of the proposal volume gets rejected).
- Operational risk check: define a metric and alert tied to this concept before deployment (in high dimensions, the acceptance rate drops exponentially because most of the proposal volume gets rejected).

---
## Reference Absorption: Rejection Sampling (cont.)
- This is the curse of dimensionality for rejection sampling.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is the curse of dimensionality for rejection sampling).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is the curse of dimensionality for rejection sampling).
- Example: sampling from a truncated normal. Use a uniform proposal over the truncated range.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (example: sampling from a truncated normal. use a uniform proposal over the truncated range).
- Operational risk check: define a metric and alert tied to this concept before deployment (example: sampling from a truncated normal. use a uniform proposal over the truncated range).
- The envelope M is the maximum of the normal PDF in that range.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the envelope m is the maximum of the normal pdf in that range).
- Operational risk check: define a metric and alert tied to this concept before deployment (the envelope m is the maximum of the normal pdf in that range).
- Example: sampling from a semicircle. Propose uniformly in the bounding rectangle.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (example: sampling from a semicircle. propose uniformly in the bounding rectangle).
- Operational risk check: define a metric and alert tied to this concept before deployment (example: sampling from a semicircle. propose uniformly in the bounding rectangle).

---
## Reference Absorption: Rejection Sampling Deep Continuation
- Accept if the point falls inside the semicircle.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (accept if the point falls inside the semicircle).
- Operational risk check: define a metric and alert tied to this concept before deployment (accept if the point falls inside the semicircle).
- This is how Monte Carlo computes pi: the acceptance rate equals the area ratio pi/4.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is how monte carlo computes pi: the acceptance rate equals the area ratio pi/4).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is how monte carlo computes pi: the acceptance rate equals the area ratio pi/4).

---
## Reference Absorption: Importance Sampling
- Sometimes you do not need samples from the target distribution p(x).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (sometimes you do not need samples from the target distribution p(x)).
- Operational risk check: define a metric and alert tied to this concept before deployment (sometimes you do not need samples from the target distribution p(x)).
- You need to estimate an expectation under p(x), and you have samples from a different distribution q(x).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (you need to estimate an expectation under p(x), and you have samples from a different distribution q(x)).
- Operational risk check: define a metric and alert tied to this concept before deployment (you need to estimate an expectation under p(x), and you have samples from a different distribution q(x)).
- This is critical in reinforcement learning.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this is critical in reinforcement learning).
- Operational risk check: define a metric and alert tied to this concept before deployment (this is critical in reinforcement learning).
- In PPO (Proximal Policy Optimization), you collect trajectories under an old policy pi_old but want to optimize a new policy pi_new.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (in ppo (proximal policy optimization), you collect trajectories under an old policy pi_old but want to optimize a new policy pi...).
- Operational risk check: define a metric and alert tied to this concept before deployment (in ppo (proximal policy optimization), you collect trajectories under an old policy pi_old but want to optimize a new...).

---
## Reference Absorption: Importance Sampling (cont.)
- PPO clips these weights to prevent the new policy from diverging too far from the old one.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (ppo clips these weights to prevent the new policy from diverging too far from the old one).
- Operational risk check: define a metric and alert tied to this concept before deployment (ppo clips these weights to prevent the new policy from diverging too far from the old one).
- The variance of the importance sampling estimator depends on how similar q is to p.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (the variance of the importance sampling estimator depends on how similar q is to p).
- Operational risk check: define a metric and alert tied to this concept before deployment (the variance of the importance sampling estimator depends on how similar q is to p).
- If q is very different from p, a few samples get enormous weights and dominate the estimate.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (if q is very different from p, a few samples get enormous weights and dominate the estimate).
- Operational risk check: define a metric and alert tied to this concept before deployment (if q is very different from p, a few samples get enormous weights and dominate the estimate).
- Self-normalized importance sampling divides by the sum of weights to reduce this problem:
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (self-normalized importance sampling divides by the sum of weights to reduce this problem:).
- Operational risk check: define a metric and alert tied to this concept before deployment (self-normalized importance sampling divides by the sum of weights to reduce this problem:).

---
## Reference Absorption: Top-p (Nucleus) Sampling
- Top-p sampling dynamically adjusts the candidate set size.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (top-p sampling dynamically adjusts the candidate set size).
- Operational risk check: define a metric and alert tied to this concept before deployment (top-p sampling dynamically adjusts the candidate set size).
- Instead of keeping a fixed number of tokens, it keeps the smallest set of tokens whose cumulative probability exceeds p.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (instead of keeping a fixed number of tokens, it keeps the smallest set of tokens whose cumulative probability exceeds p).
- Operational risk check: define a metric and alert tied to this concept before deployment (instead of keeping a fixed number of tokens, it keeps the smallest set of tokens whose cumulative probability exceeds p).
- When the model is confident, nucleus sampling keeps few tokens (maybe 2-3).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (when the model is confident, nucleus sampling keeps few tokens (maybe 2-3)).
- Operational risk check: define a metric and alert tied to this concept before deployment (when the model is confident, nucleus sampling keeps few tokens (maybe 2-3)).
- When the model is uncertain, it keeps many (maybe 200).
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (when the model is uncertain, it keeps many (maybe 200)).
- Operational risk check: define a metric and alert tied to this concept before deployment (when the model is uncertain, it keeps many (maybe 200)).

---
## Reference Absorption: Top-p (Nucleus) Sampling (cont.)
- This adaptive behavior is why nucleus sampling generally produces better text than top-k.
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (this adaptive behavior is why nucleus sampling generally produces better text than top-k).
- Operational risk check: define a metric and alert tied to this concept before deployment (this adaptive behavior is why nucleus sampling generally produces better text than top-k).
- Temperature 0.7 + top-p 0.9: good general-purpose setting
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (temperature 0.7 + top-p 0.9: good general-purpose setting).
- Operational risk check: define a metric and alert tied to this concept before deployment (temperature 0.7 + top-p 0.9: good general-purpose setting).
- Temperature 0.0 (greedy): best for deterministic tasks
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (temperature 0.0 (greedy): best for deterministic tasks).
- Operational risk check: define a metric and alert tied to this concept before deployment (temperature 0.0 (greedy): best for deterministic tasks).
- Temperature 1.0 + top-k 50: Fan et al. (2018) original paper setting
- Engineering implication: if this assumption is violated, model quality, stability, or calibration can degrade in production (temperature 1.0 + top-k 50: fan et al. (2018) original paper setting).
- Operational risk check: define a metric and alert tied to this concept before deployment (temperature 1.0 + top-k 50: fan et al. (2018) original paper setting).

---
## Beyond Reference: Engineering Translation
- Core anchors for this module: sampling, sample, distribution, samples, random, proposal, softmax, uniform.
- Convert each theoretical primitive into measurable behaviors in training and inference pipelines.
- Define observability checkpoints so regressions are detected before deployment impact.
- Tie mathematical assumptions to concrete data contracts and monitoring thresholds.

---
## Beyond Reference: Advanced Layer 1
- Compare rejection sampling, importance sampling, and MCMC by effective sample size.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (compare rejection sampling, importance sampling, and mcmc by effective sample size.).
- Diagnose sampler mixing with autocorrelation, R-hat, and trace-plot analysis.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (diagnose sampler mixing with autocorrelation, r-hat, and trace-plot analysis.).
- Use variance-reduction techniques for Monte Carlo estimators in probabilistic ML.
- Risk and governance extension: convert this advanced point into explicit acceptance tests and rollback criteria (use variance-reduction techniques for monte carlo estimators in probabilistic ml.).

---
## Beyond Reference: Research to Production Loop
- Start from a benchmarked baseline and publish ablations that isolate each mathematical choice.
- Stress-test with adversarial and out-of-distribution inputs aligned to the module's assumptions.
- Maintain a rollback-safe deployment strategy with guardrails for confidence, drift, and latency budgets.
- Document invariant checks that must remain true after every optimization or refactor.

<!-- DEPTH_EXPANSION_END -->
