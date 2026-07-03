import { execSync } from 'child_process';

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;
const output = JSON.parse(execSync('npm list --json --depth=0').toString());
const deps = Object.keys(output.dependencies ?? {});

for (const pkg of deps) {
  const info = JSON.parse(execSync(`npm view ${pkg} --json`).toString());
  const published = new Date(info.time[info['dist-tags'].latest]);
  const age = Date.now() - published.getTime();

  if (age < TWO_WEEKS_MS) {
    console.error(
      `❌ ${pkg}@${info['dist-tags'].latest} was published less than 2 weeks ago (${published.toDateString()})`
    );
    process.exit(1);
  }
}

console.log('✅ All packages pass the 2-week age check');
