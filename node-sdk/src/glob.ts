import * as glob from '@actions/glob';
import type {GlobOptions} from '@actions/glob';

export async function* lookup(pattern: string, options: GlobOptions|undefined = undefined): AsyncGenerator<string, void> {
    const finalOptions = {
        followSymbolicLinks: options?.followSymbolicLinks ?? true,
        implicitDescendants: options?.implicitDescendants ?? false, // False by default to avoid big results !
        matchDirectories: options?.implicitDescendants ?? false, // False by default to avoid big results !
        omitBrokenSymbolicLinks: options?.omitBrokenSymbolicLinks ?? false, // Avoid error related to broken files
    };

    const globber = await glob.create(pattern, finalOptions);

    yield* globber.globGenerator();
}
